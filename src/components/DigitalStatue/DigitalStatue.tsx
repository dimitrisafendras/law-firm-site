import { useEffect, useRef } from 'react';
import { breakpoints } from '@/theme';
// Responsive statue variants — Vite hashes each import to its own URL, so the
// srcSet strings below are built from these imported URLs (a single import can't
// express a multi-file srcset).
import statue700Avif from '@/assets/images/hero-statue-700.avif';
import statue1050Avif from '@/assets/images/hero-statue-1050.avif';
import statue1400Avif from '@/assets/images/hero-statue-1400.avif';
import statue700Webp from '@/assets/images/hero-statue-700.webp';
import statue1050Webp from '@/assets/images/hero-statue-1050.webp';
import statue1400Webp from '@/assets/images/hero-statue-1400.webp';
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

  flameLeft: {
    wMul: 0.5,
    wMulMobile: 0.4,
    hMul: 1.15,
    hMulMobile: 1,
    max: 60,
    maxMobile: 25,
    colors: { hot: '255,240,200', mid: '255,180,80', outer: '255,120,40' },
  },

  flameRight: {
    wMul: 0.5,
    wMulMobile: 0.4,
    hMul: 1.15,
    hMulMobile: 1,
    max: 60,
    maxMobile: 25,
    colors: { hot: '220,245,255', mid: '137,207,240', outer: '137,207,240' },
  },
} as const;

// ── Pre-render rain sprite sheet (main thread, once) ─────────────────────────
const FONT_SIZE = ANIMATION_CONFIG.rain.fontSize;
const TRAIL = ANIMATION_CONFIG.rain.trail;
const CELL = FONT_SIZE + 2;

function createRainSprite(): Promise<ImageBitmap> {
  const c = document.createElement('canvas');
  c.width = CELL * 2;
  c.height = CELL * TRAIL;
  const ctx = c.getContext('2d')!;
  ctx.font = `${FONT_SIZE}px monospace`;
  ctx.textBaseline = 'top';
  for (let j = 0; j < TRAIL; j++) {
    const fade = 1 - j / TRAIL;
    ctx.fillStyle = j === 0
      ? `rgba(188,232,255,${(0.9 * fade).toFixed(3)})`
      : `rgba(137,207,240,${(0.7 * fade).toFixed(3)})`;
    ctx.fillText('0', 0, j * CELL);
    ctx.fillText('1', CELL, j * CELL);
  }
  return createImageBitmap(c);
}

// ── Star constants ──────────────────────────────────────────────────────────
const STAR_SPRITE_SIZE = ANIMATION_CONFIG.star.spriteSize;

// ── Pre-render star sprite (main thread, once) ───────────────────────────────
function createStarSprite(): Promise<ImageBitmap> {
  const SIZE = STAR_SPRITE_SIZE;
  const c = document.createElement('canvas');
  c.width = SIZE; c.height = SIZE;
  const ctx = c.getContext('2d')!;
  const cx = SIZE / 2, r = SIZE / 2;

  ctx.beginPath(); ctx.arc(cx, cx, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(188,232,255,0.1)'; ctx.fill();

  ctx.fillStyle = 'rgba(220,245,255,0.9)';
  const s = r * 0.25, l = r * 0.9;
  ctx.beginPath(); ctx.moveTo(cx, cx - l); ctx.lineTo(cx + s, cx - s); ctx.lineTo(cx, cx); ctx.lineTo(cx - s, cx - s); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx, cx + l); ctx.lineTo(cx + s, cx + s); ctx.lineTo(cx, cx); ctx.lineTo(cx - s, cx + s); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx - l, cx); ctx.lineTo(cx - s, cx + s); ctx.lineTo(cx, cx); ctx.lineTo(cx - s, cx - s); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx + l, cx); ctx.lineTo(cx + s, cx - s); ctx.lineTo(cx, cx); ctx.lineTo(cx + s, cx + s); ctx.closePath(); ctx.fill();

  ctx.beginPath(); ctx.arc(cx, cx, r * 0.15, 0, Math.PI * 2);
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

// ── Responsive statue sources ────────────────────────────────────────────────
const STATUE_AVIF_SRCSET = `${statue700Avif} 700w, ${statue1050Avif} 1050w, ${statue1400Avif} 1400w`;
const STATUE_WEBP_SRCSET = `${statue700Webp} 700w, ${statue1050Webp} 1050w, ${statue1400Webp} 1400w`;
// Honest heuristic: the statue is sized by HEIGHT (CSS `height:100%; width:auto`
// inside .hero-section__bg), so its rendered *width* isn't a clean function of
// viewport width. In practice it lands near 45vw on desktop (~684px on a ~1520px
// viewport) and close to full width on the ≤1024px mobile layout. This `sizes`
// approximation drives the srcset picker toward the right variant at up to
// ~2 DPR (desktop) / ~3 DPR (mobile).
const STATUE_SIZES = '(max-width: 1024px) 90vw, 45vw';

interface DigitalStatueProps { className?: string }

export function DigitalStatue({ className = '' }: DigitalStatueProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rainRef = useRef<HTMLCanvasElement>(null);
  const spkBodyRef = useRef<HTMLCanvasElement>(null);
  const spkScaleRef = useRef<HTMLCanvasElement>(null);
  const flameLRef = useRef<HTMLCanvasElement>(null);
  const flameRRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
      // Pre-render sprites on main thread
      const [rainSprite, starSprite] = await Promise.all([createRainSprite(), createStarSprite()]);
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

      // Rain worker
      add(rainRef.current, RainWorkerUrl, {
        sprite: rainSprite,
        fontSize: rain.fontSize,
        trail: mobile ? rain.trailMobile : rain.trail,
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
        colors: flameRight.colors,
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
  }, []);

  return (
    <div ref={containerRef} className={`digital-statue ${className}`.trim()}>
       {/*Back layer: rain + flames (behind statue)*/}
      <div className="digital-statue__rain-wrap">
        <canvas ref={rainRef} className="digital-statue__rain" />
      </div>

      <picture>
        <source type="image/avif" srcSet={STATUE_AVIF_SRCSET} sizes={STATUE_SIZES} />
        <source type="image/webp" srcSet={STATUE_WEBP_SRCSET} sizes={STATUE_SIZES} />
        <img
          src={statue1400Webp}
          alt=""
          className="digital-statue__img"
          width={1400}
          height={1875}
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      {/* Front layer: sparkles (on top of statue) */}
      <div className="digital-statue__sparkles-wrap digital-statue__sparkles-body">
        <canvas ref={spkBodyRef} className="digital-statue__sparkle-canvas" />
      </div>
      <div className="digital-statue__sparkles-wrap digital-statue__sparkles-scale">
        <canvas ref={spkScaleRef} className="digital-statue__sparkle-canvas" />
      </div>

      {/* Flames (behind statue, inside back layer z-index) */}
      <div className="digital-statue__flame digital-statue__flame--left">
        <canvas ref={flameLRef} className="digital-statue__flame-canvas" />
      </div>
      <div className="digital-statue__flame digital-statue__flame--right">
        <canvas ref={flameRRef} className="digital-statue__flame-canvas" />
      </div>
    </div>
  );
}
