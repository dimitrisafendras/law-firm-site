import { useEffect, useRef } from 'react';
import { breakpoints, resolveStatue } from '@/theme';
import { useTheme } from '@/lib/theme';
import { type SceneColors } from './sceneColors.ts';
// What the scene is painted in. Which image the hero shows is decided in CSS,
// not here — see the note in statueArtwork.ts.
import { artworkFor } from './statueArtwork.ts';
import RainWorkerUrl from './rainWorker.ts?worker&url';
import SparkleWorkerUrl from './sparkleWorker.ts?worker&url';
import FlameWorkerUrl from './flameWorker.ts?worker&url';
import './DigitalStatue.css';

// ── Animation configuration ──────────────────────────────────────────────────
// Single source of truth for tuning every canvas effect in the statue scene.
// Values suffixed with `Mobile` apply at viewport widths ≤ MOBILE_BREAKPOINT.
const ANIMATION_CONFIG = {
  // Single source of truth is the theme token; CSS media queries duplicate the
  // literal 1024px by necessity (see tokens.ts breakpoints).
  mobileBreakpoint: parseInt(breakpoints.mobile, 10),

  rain: {
    fontSize: 4,
    trail: 20,
    trailMobile: 10,
  },

  sparkleBody: {
    count: 250,
    countMobile: 50,
    speed: 0.2,
    speedMobile: 0.2,
    drawScale: 5,
  },

  sparkleScale: {
    count: 20,
    countMobile: 4,
    speed: 0.1,
    speedMobile: 0.1,
    drawScale: 4,
  },

  star: {
    spriteSize: 32,
  },

  /* The two pans of the scales. The left burns as literal fire, the right in
     the statue's own wireframe colour — see sceneColors.ts for why neither
     follows the palette: they hang inches from a photograph whose wireframe is
     baked into the file, and a khaki flame beside a cyan statue reads as a bug,
     not as a theme. What DOES vary is which photograph is hanging there; see
     statueArtwork.ts. */
  flameLeft: {
    wMul: 0.5,
    wMulMobile: 0.4,
    hMul: 1.15,
    hMulMobile: 1,
    max: 60,
    maxMobile: 25,
    colors: { hot: '255,240,200', mid: '255,180,80', outer: '255,120,40' },
  },

  /* No `colors` here, unlike flameLeft: the cool pan burns in the STATUE's
     colour, and which statue that is now depends on the palette. Built from
     `artwork.colors` in `start()` instead. */
  flameRight: {
    wMul: 0.5,
    wMulMobile: 0.4,
    hMul: 1.15,
    hMulMobile: 1,
    max: 60,
    maxMobile: 25,
  },
} as const;

/** The cool pan's fire, in whichever artwork's wireframe is on screen. */
const coolFlameColors = (c: SceneColors) => ({
  hot: c.accentBright,
  mid: c.secondary,
  outer: c.secondary,
});

// ── Pre-render rain sprite sheet (main thread, once) ─────────────────────────
const FONT_SIZE = ANIMATION_CONFIG.rain.fontSize;
const TRAIL = ANIMATION_CONFIG.rain.trail;
const CELL = FONT_SIZE + 2;

function createRainSprite(colors: SceneColors): Promise<ImageBitmap> {
  const c = document.createElement('canvas');
  c.width = CELL * 2;
  c.height = CELL * TRAIL;
  const ctx = c.getContext('2d')!;
  ctx.font = `${FONT_SIZE}px monospace`;
  ctx.textBaseline = 'top';
  for (let j = 0; j < TRAIL; j++) {
    const fade = 1 - j / TRAIL;
    ctx.fillStyle = j === 0
      ? `rgba(${colors.accent},${(0.9 * fade).toFixed(3)})`
      : `rgba(${colors.secondary},${(0.7 * fade).toFixed(3)})`;
    ctx.fillText('0', 0, j * CELL);
    ctx.fillText('1', CELL, j * CELL);
  }
  return createImageBitmap(c);
}

// ── Star constants ──────────────────────────────────────────────────────────
const STAR_SPRITE_SIZE = ANIMATION_CONFIG.star.spriteSize;

// ── Pre-render star sprite (main thread, once) ───────────────────────────────
function createStarSprite(colors: SceneColors): Promise<ImageBitmap> {
  const SIZE = STAR_SPRITE_SIZE;
  const c = document.createElement('canvas');
  c.width = SIZE; c.height = SIZE;
  const ctx = c.getContext('2d')!;
  const cx = SIZE / 2, r = SIZE / 2;

  ctx.beginPath(); ctx.arc(cx, cx, r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${colors.accent},0.1)`; ctx.fill();

  ctx.fillStyle = `rgba(${colors.accentBright},0.9)`;
  const s = r * 0.25, l = r * 0.9;
  ctx.beginPath(); ctx.moveTo(cx, cx - l); ctx.lineTo(cx + s, cx - s); ctx.lineTo(cx, cx); ctx.lineTo(cx - s, cx - s); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx, cx + l); ctx.lineTo(cx + s, cx + s); ctx.lineTo(cx, cx); ctx.lineTo(cx - s, cx + s); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx - l, cx); ctx.lineTo(cx - s, cx + s); ctx.lineTo(cx, cx); ctx.lineTo(cx - s, cx - s); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx + l, cx); ctx.lineTo(cx + s, cx - s); ctx.lineTo(cx, cx); ctx.lineTo(cx + s, cx + s); ctx.closePath(); ctx.fill();

  ctx.beginPath(); ctx.arc(cx, cx, r * 0.15, 0, Math.PI * 2);
  // White on purpose in every palette: this is a specular highlight, not a
  // brand colour — the same call the glass material makes for its `highlight`.
  ctx.fillStyle = 'rgba(255,255,255,1)'; ctx.fill();

  return createImageBitmap(c);
}

// ── Helper: create worker + transfer canvas ──────────────────────────────────
/** Cap the device-pixel-ratio so we never allocate an absurd canvas buffer. */
function getDpr(): number {
  return Math.min(window.devicePixelRatio || 1, 2);
}

function spawnWorker(
  url: string,
  canvas: HTMLCanvasElement,
  initMsg: Record<string, unknown>,
): Worker | null {
  try {
    // Size the canvas buffer to its CSS container × dpr BEFORE transferring.
    // The worker draws in CSS-pixel coordinates (ctx.scale(dpr, dpr)), while
    // the CSS `width/height: 100%` keeps the element at its display size.
    const wrap = canvas.parentElement!;
    const rect = wrap.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    const dpr = getDpr();
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(url, { type: 'module' });
    worker.postMessage({ type: 'init', canvas: offscreen, width: w, height: h, dpr, ...initMsg }, [offscreen]);
    return worker;
  } catch {
    return null;
  }
}

interface DigitalStatueProps { className?: string }

export function DigitalStatue({ className = '' }: DigitalStatueProps) {
  /*
   * Which statue is on screen — a reader's pin, else the palette family's —
   * and what its scene is painted in. It does NOT pick the image here: that is
   * a `background-image` the generated stylesheet swaps on `[data-theme]` /
   * `[data-statue]`, so exactly one file is ever requested and the prerendered
   * markup stays theme-agnostic.
   * statueArtwork.ts has the full account of why the image cannot be chosen in
   * React.
   *
   * Everything read here is consumed inside the effect below, after mount, or as
   * a React key — never as rendered markup, so none of it can mismatch during
   * hydration. A key is identity, not output: it changes which DOM node the
   * canvas is, and hydration reconciles that without a server/client diff.
   *
   * `artworkFor` returns one of five module constants, so `artwork` is
   * referentially stable and the scene is rebuilt only when the drawing under it
   * actually changes.
   */
  const { palette, mode, statue } = useTheme();
  const resolved = resolveStatue(palette.family, statue);
  const artwork = artworkFor(resolved.id);
  /* The identity of the five canvases — see the note on the returned markup. */
  const canvasKey = `${artwork.id}-${mode}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const rainRef = useRef<HTMLCanvasElement>(null);
  const spkBodyRef = useRef<HTMLCanvasElement>(null);
  const spkScaleRef = useRef<HTMLCanvasElement>(null);
  const flameLRef = useRef<HTMLCanvasElement>(null);
  const flameRRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /*
     * The classic look keeps the fire and drops the dissolution.
     *
     * Both looks now wear the same photograph — there is no marble render, and
     * src/theme/statues.ts says why — so the two scale pans hold the same two
     * flames the digital look gives them, in the same colours: the warm one on
     * the brass pan, the cool one in whatever wireframe is on screen. That is
     * not a digital effect, it is the lighting the photograph was composed
     * with, and sceneColors.ts's rule cuts the other way here. A palette-toned
     * CSS glow stood in for them while the marble statue existed; over a cyan
     * wireframe it is the khaki-fire bug in a new place.
     *
     * What the classic look does drop is the rain and the two sparkle fields —
     * the dissolving edge itself. Their canvases are `display: none` in
     * src/styles/classic.css, and the three workers are not spawned at all, so
     * the look pays for two OffscreenCanvas transfers rather than five, and for
     * neither of the sprite sheets those three need.
     */
    const dissolving = mode !== 'classic';

    const container = containerRef.current;
    if (!container) return;

    // Track each worker with the canvas element it drives, so a resize can
    // re-measure the correct wrapper per canvas.
    const entries: { worker: Worker; canvas: HTMLCanvasElement }[] = [];
    let intersectionObserver: IntersectionObserver | null = null;
    let cancelled = false;
    let started = false;
    let debounceId: ReturnType<typeof setTimeout> | undefined;

    async function start() {
      // Pre-render sprites on the main thread, in the statue's own colours.
      // Only the rain and the sparkles use them, so the classic look builds
      // neither.
      const [rainSprite, starSprite] = dissolving
        ? await Promise.all([createRainSprite(artwork.colors), createStarSprite(artwork.colors)])
        : [null, null];
      if (cancelled) return;

      const mobile = window.innerWidth <= ANIMATION_CONFIG.mobileBreakpoint;
      const { rain, sparkleBody, sparkleScale, flameLeft, flameRight } = ANIMATION_CONFIG;

      const add = (
        canvasEl: HTMLCanvasElement | null,
        url: string,
        msg: Record<string, unknown>,
      ) => {
        if (!canvasEl) return;
        const worker = spawnWorker(url, canvasEl, msg);
        if (worker) entries.push({ worker, canvas: canvasEl });
      };

      if (dissolving) {
        // Rain worker. `colors` drives only the worker's no-sprite fallback
        // path; the sprite above already carries them everywhere else.
        add(rainRef.current, RainWorkerUrl, {
          sprite: rainSprite,
          fontSize: rain.fontSize,
          trail: mobile ? rain.trailMobile : rain.trail,
          colors: { head: artwork.colors.accent, trail: artwork.colors.secondary },
        });

        // Sparkle body worker
        add(spkBodyRef.current, SparkleWorkerUrl, {
          sprite: starSprite,
          count: mobile ? sparkleBody.countMobile : sparkleBody.count,
          speed: mobile ? sparkleBody.speedMobile : sparkleBody.speed,
          drawScale: sparkleBody.drawScale,
        });

        // Sparkle scale worker
        add(spkScaleRef.current, SparkleWorkerUrl, {
          sprite: starSprite,
          count: mobile ? sparkleScale.countMobile : sparkleScale.count,
          speed: mobile ? sparkleScale.speedMobile : sparkleScale.speed,
          drawScale: sparkleScale.drawScale,
        });
      }

      // Flame left worker
      add(flameLRef.current, FlameWorkerUrl, {
        wMul: mobile ? flameLeft.wMulMobile : flameLeft.wMul,
        hMul: mobile ? flameLeft.hMulMobile : flameLeft.hMul,
        max: mobile ? flameLeft.maxMobile : flameLeft.max,
        colors: flameLeft.colors,
      });

      // Flame right worker
      add(flameRRef.current, FlameWorkerUrl, {
        wMul: mobile ? flameRight.wMulMobile : flameRight.wMul,
        hMul: mobile ? flameRight.hMulMobile : flameRight.hMul,
        max: mobile ? flameRight.maxMobile : flameRight.max,
        colors: coolFlameColors(artwork.colors),
      });

      // Visibility observer — pause/resume all workers
      intersectionObserver = new IntersectionObserver(([entry]) => {
        for (const { worker } of entries) {
          worker.postMessage({ type: 'visibility', visible: entry.isIntersecting });
        }
      }, { threshold: 0 });
      intersectionObserver.observe(container!);
    }

    // A single ResizeObserver drives both startup (fires once the container has
    // a non-zero size — replacing the old synthetic resize-on-img-load hack)
    // and subsequent debounced resize propagation to each worker.
    const resizeObserver = new ResizeObserver(() => {
      const rect = container!.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      if (!started) {
        started = true;
        void start();
        return;
      }

      clearTimeout(debounceId);
      debounceId = setTimeout(() => {
        if (cancelled) return;
        const dpr = getDpr();
        for (const { worker, canvas } of entries) {
          const r = canvas.parentElement!.getBoundingClientRect();
          worker.postMessage({
            type: 'resize',
            width: Math.round(r.width),
            height: Math.round(r.height),
            dpr,
          });
        }
      }, 150);
    });
    resizeObserver.observe(container);

    return () => {
      cancelled = true;
      clearTimeout(debounceId);
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      for (const { worker } of entries) worker.terminate();
    };
    /*
     * Re-runs when the artwork or the mode changes, and both must tear the scene
     * down and rebuild it: the sprites are pre-rendered in the artwork's colours
     * and the flame workers are handed theirs at spawn, and crossing into the
     * classic look has to terminate the three dissolution workers rather than
     * leave them painting under a `display: none`. The canvases below are keyed
     * on the same pair, so each re-run gets fresh elements — see the note on the
     * returned markup for why that is not optional.
     */
  }, [artwork, mode]);

  return (
    /*
     * `transferControlToOffscreen()` may be called ONCE per canvas element, so a
     * re-run of the effect against the same five DOM nodes throws, spawnWorker
     * swallows it, and the scene goes permanently dead. That used to be a note
     * warning the next person; it is now load-bearing, because the effect DOES
     * re-run — on a statue change, and on a change of look.
     *
     * The key is what makes that safe: React discards the old canvas and mounts
     * a new one, so the re-run gets an untransferred element. The mode is in the
     * key as well as the artwork, because digital → classic → digital returns to
     * the same artwork id and would otherwise hand the second digital pass the
     * same already-transferred nodes the first one consumed — the two flame
     * canvases included, since the classic pass transfers those itself. The outgoing
     * workers are terminated by the effect's own cleanup.
     */
    <div ref={containerRef} className={`digital-statue ${className}`.trim()}>
       {/*Back layer: rain + flames (behind statue)*/}
      <div className="digital-statue__rain-wrap">
        <canvas key={canvasKey} ref={rainRef} className="digital-statue__rain" />
      </div>

      {/*
        * A div, not an <img>, because the file is chosen by the palette and the
        * palette is a CSS attribute — see statueArtwork.ts. The drawing is
        * decorative (the <img> it replaces carried `alt=""`), so nothing is
        * owed to assistive tech here.
        *
        * The trade, stated plainly: an <img> in the HTML is found by the
        * preload scanner immediately, whereas a background image waits for the
        * stylesheet and for layout, so the hero's LCP candidate is discovered
        * later. A `<link rel="preload">` cannot buy that back — there are two
        * artworks and the head does not know which one this reader gets, so
        * preloading either would hand ten of eighteen palettes a second useless
        * request, which is the exact cost this change removed.
        *
        * The resolution ladder also changes hands: `<img srcset>` picked by
        * rendered width via `sizes`, `image-set()` picks by device pixel ratio.
        * The generated stylesheet maps 700=1x / 1050=1.5x / 1400=2x.
        */}
      <div key={canvasKey} className="digital-statue__img" role="presentation" />

      {/* Front layer: sparkles (on top of statue) */}
      <div className="digital-statue__sparkles-wrap digital-statue__sparkles-body">
        <canvas key={canvasKey} ref={spkBodyRef} className="digital-statue__sparkle-canvas" />
      </div>
      <div className="digital-statue__sparkles-wrap digital-statue__sparkles-scale">
        <canvas key={canvasKey} ref={spkScaleRef} className="digital-statue__sparkle-canvas" />
      </div>

      {/* Flames (behind statue, inside back layer z-index) */}
      <div className="digital-statue__flame digital-statue__flame--left">
        <canvas key={canvasKey} ref={flameLRef} className="digital-statue__flame-canvas" />
      </div>
      <div className="digital-statue__flame digital-statue__flame--right">
        <canvas key={canvasKey} ref={flameRRef} className="digital-statue__flame-canvas" />
      </div>
    </div>
  );
}
