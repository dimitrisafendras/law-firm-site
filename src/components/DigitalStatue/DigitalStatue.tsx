import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { breakpoints, resolveStatue } from '@/theme';
import { useTheme } from '@/lib/theme';
import { artworkFor } from './statueArtwork';
// The Rive mesh is baked in this blue whichever statue shows (see
// scripts/build-hero-rive.mjs), so its entrance scan is too.
import { ULTRAMARINE_COLORS } from './sceneColors';
import type { ImageAsset, Rive } from '@rive-app/webgl2';
import riveWasm from '@rive-app/webgl2/rive.wasm?url';
import './DigitalStatue.css';

// Decode the CSS-selected artwork without moving palette selection into React.
async function decodeArtwork(element: Element) {
  const background = getComputedStyle(element).backgroundImage;
  const candidates = [...background.matchAll(/url\(["']?([^"')]+)["']?\)/g)];
  // Computed image-set syntax can put type() between the URL and resolution.
  const urls = candidates.map(match => match[1]);
  const groups = [urls.filter(url => url.endsWith('.avif')), urls.filter(url => url.endsWith('.webp'))];
  for (const group of groups) {
    if (!group.length) continue;
    const image = new Image();
    image.srcset = group.map((url, i) => `${url} ${[1, 1.5, 2][i]}x`).join(', ');
    image.src = group[group.length - 1];
    try { await image.decode(); return; } catch { /* Try the fallback format. */ }
  }
  throw new Error('Statue artwork could not be decoded');
}

// Rive's start-up — instantiating the WASM, parsing the .riv, first shader
// compile — is ~0.4s of main-thread work. Run during the hero entrance, it
// stalls every main-thread animation in it, so it is held back until the
// entrance is nearly over (scroll-driven animations never finish and are
// excluded) — and not a moment longer: an idle-callback wait here once cost
// half a second for nothing.
//
// "Nearly over" is the hero's letters, when there are any: this resolves
// `lead` ms before the last of them lands and reports when that is. Waiting
// for every entrance held the statue back behind the scroll hint and the
// action panel, ~0.35s past the last letter, and that read as a pause. The
// letters and the hint only animate opacity, transform and filter, which the
// compositor runs straight through Rive's start-up; the panel's clip-path is
// composited too, and in the slow tail of its curve by then.
function afterEntrances(signal: AbortSignal, lead: number): Promise<number> {
  const running = (document.getAnimations?.() ?? []).filter(animation =>
    animation.timeline === document.timeline &&
    animation.playState === 'running' &&
    animation.effect?.getTiming().iterations !== Infinity);
  const letters = running.filter(animation => {
    const target = (animation.effect as KeyframeEffect | null)?.target;
    return target instanceof Element && target.closest('.spawn-text') !== null;
  });
  const ends = letters.map(animation => {
    const end = animation.effect?.getComputedTiming().endTime;
    return animation.startTime == null || typeof end !== 'number' ? null : Number(animation.startTime) + end;
  });
  const cap = new Promise(resolve => setTimeout(resolve, 4000));
  let settled: Promise<unknown>;
  let landing = 0;
  if (letters.length && ends.every(end => end !== null)) {
    landing = Math.max(...(ends as number[]));
    settled = new Promise(resolve => setTimeout(resolve, Math.max(0, landing - lead - performance.now())));
  } else {
    settled = Promise.allSettled((letters.length ? letters : running).map(animation => animation.finished));
  }
  return Promise.race([settled, cap]).then(() => new Promise<number>(resolve => {
    if (!signal.aborted) resolve(landing || performance.now());
  }));
}

// A CSS time token in milliseconds.
const tokenMs = (name: string) =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) * 1000 || 0;

// Art lighting, deliberately independent of the page palette.
const mobileBreakpoint = parseInt(breakpoints.mobile, 10);

export function DigitalStatue({ className = '' }: { className?: string }) {
  const { palette, mode, statue } = useTheme();
  const artwork = artworkFor(resolveStatue(palette.family, statue).id);
  const canvasKey = `${artwork.id}-${mode}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia(`(min-width: ${mobileBreakpoint + 1}px)`);
    const instances: Rive[] = [];
    let runtime: typeof import('@rive-app/webgl2');
    let cancelled = false;
    let started = false;
    let inView = false;
    let assetsReady = false;
    let pageHidden = false;
    // Every Rive frame copies the WebGL result into a 2D canvas, which makes
    // the main thread wait on the GPU. The first time a glass-heavy section
    // scrolls into view the GPU is busy painting it, and that wait turned into
    // 140-280ms frames. The ambient light is slow enough that holding it still
    // for the length of a scroll is invisible, so it does.
    let scrolling = false;
    let scrollTimer = 0;
    let revealFrame = 0;
    let chargeAt = 0;
    let chargeTimer = 0;
    const abort = new AbortController();
    container.dataset.scene = 'loading';
    container.dataset.surface = 'loading';
    const imageReady = decodeArtwork(container.querySelector('.digital-statue__img')!);
    // Attach a rejection handler immediately while the runtime is loading.
    void imageReady.catch(() => {});
    const reveal = () => {
      if (!cancelled && !pageHidden) container.dataset.scene = 'ready';
    };
    const fallback = () => {
      if (cancelled) return;
      container.dataset.surface = 'failed';
      clearTimeout(fallbackTimer);
      for (const rive of instances) rive.pause();
      reveal();
    };
    // A failed or stalled runtime must never leave the photograph hidden.
    let fallbackTimer = window.setTimeout(fallback, 10000);
    const sync = () => {
      for (const rive of instances) {
        if (!pageHidden && !scrolling && assetsReady && container.dataset.surface !== 'failed' && inView && !document.hidden && !motion.matches && desktop.matches) rive.play('Ambient');
        else rive.pause();
      }
    };
    const add = (canvas: HTMLCanvasElement | null, artboard: string, buffer: ArrayBuffer) => {
      if (!canvas || cancelled) return;
      const { Rive, Layout, Fit, Alignment, DrawOptimizationOptions } = runtime;
      const images: Promise<void>[] = [];
      const rive = new Rive({
        canvas, buffer, artboard, stateMachine: 'Ambient', autoplay: false,
        // Copy completed GPU frames into a normal 2D canvas. A directly
        // composited WebGL surface can flash opaque during rapid navigations.
        useOffscreenRenderer: true,
        layout: new Layout({ fit: Fit.Fill, alignment: Alignment.Center }),
        // Ambient opacity changes are deliberately tiny. Present each active
        // frame rather than relying on the runtime's dirty-scene heuristic.
        drawingOptions: DrawOptimizationOptions.AlwaysDraw,
        shouldDisableRiveListeners: true, enableRiveAssetCDN: false,
        assetLoader: (asset, bytes) => {
          if (!asset.isImage) return false;
          const decoded = runtime.decodeImage(bytes).then(image => {
            try {
              if (!cancelled) (asset as ImageAsset).setRenderImage(image);
            } finally { image.unref(); }
          });
          images.push(decoded);
          void decoded.catch(fallback);
          return true;
        },
        onLoad: () => {
          void Promise.all([imageReady, ...images]).then(() => {
            if (cancelled || container.dataset.surface === 'failed') return;
            assetsReady = true;
            rive.resizeDrawingSurfaceToCanvas(Math.min(devicePixelRatio, 1.5));
            sync();
          }).catch(fallback);
        },
        onLoadError: fallback,
        onAdvance: () => {
          if (!assetsReady || cancelled || pageHidden || revealFrame) return;
          // Advance fires before draw, and Rive's first frames compile shaders
          // and upload textures — 100ms+ each. Revealing on a fixed frame count
          // still caught the tail of that and the entrance stuttered as it
          // began, so wait until the layer is actually rendering smoothly:
          // three consecutive short frames, capped so it can never hang.
          const began = performance.now();
          let last = began, smooth = 0;
          const settle = (now: number) => {
            if (cancelled || pageHidden || container.dataset.surface === 'failed') return;
            smooth = now - last < 25 ? smooth + 1 : 0;
            last = now;
            if (smooth < 3 && now - began < 500) { revealFrame = requestAnimationFrame(settle); return; }
            clearTimeout(fallbackTimer);
            // The glare and the light it switches on are one event: the band
            // climbs the figure and the live mesh appears right behind it, so
            // the charge waits for this first smooth frame — and, when Rive is
            // early, for a beat before the last word lands.
            const show = () => {
              if (cancelled || pageHidden || container.dataset.surface === 'failed') return;
              container.dataset.charge = 'on';
              container.dataset.surface = 'ready';
              reveal();
            };
            const wait = container.dataset.charge === 'on' ? 0 : chargeAt - performance.now();
            if (wait > 0) chargeTimer = window.setTimeout(show, wait);
            else show();
          };
          revealFrame = requestAnimationFrame(settle);
        },
      });
      instances.push(rive);
    };
    // Only the network is done up front, all three requests in parallel and at
    // low priority behind the page's own assets: it costs the main thread
    // nothing. Instantiating the WASM is itself ~0.3s of main-thread work on a
    // cold visit, so the runtime is not touched until afterEntrances. The WASM
    // is fetched here only to warm the HTTP cache for RuntimeLoader's request.
    const download = () => Promise.all([
      import('@rive-app/webgl2'),
      fetch(`${import.meta.env.BASE_URL}animations/hero.riv`, { signal: abort.signal, priority: 'low' })
        .then(response => {
          if (!response.ok) throw new Error(`Statue animation: HTTP ${response.status}`);
          return response.arrayBuffer();
        }),
      fetch(riveWasm, { signal: abort.signal, priority: 'low' }).then(response => response.arrayBuffer()),
    ]);
    const start = (loaded: typeof import('@rive-app/webgl2'), buffer: ArrayBuffer) => {
      runtime = loaded;
      runtime.RuntimeLoader.setWasmUrl(riveWasm);
      runtime.RuntimeLoader.setWasmFallbackUrl(null);
      if (surfaceRef.current) add(surfaceRef.current, 'Mesh', buffer);
    };
    const maybeStart = () => {
      // The photograph enters on its own schedule; the Rive light layer joins
      // it later (see afterEntrances) and fades in over it.
      void imageReady.then(reveal).catch(fallback);
      if (mode === 'classic' || motion.matches || !desktop.matches) clearTimeout(fallbackTimer);
      if (!started && mode !== 'classic' && !motion.matches && desktop.matches && inView) {
        started = true;
        clearTimeout(fallbackTimer);
        const downloads = download();
        void downloads.catch(() => {});
        // The charge is due a beat before the last word lands — it is fully
        // visible by then, the rest of its curve is a settle — and Rive
        // starts a further beat and a tight beat ahead of that, about its own
        // start-up time, so it is rendering by the moment it is due (see
        // onAdvance).
        const beat = tokenMs('--seq-beat');
        const startLead = 2 * beat + tokenMs('--seq-beat-tight');
        void imageReady.then(() => afterEntrances(abort.signal, startLead)).then(async landing => {
          if (cancelled) return;
          chargeAt = landing - beat;
          fallbackTimer = window.setTimeout(fallback, 10000);
          try {
            const [loaded, buffer] = await downloads;
            if (!cancelled) start(loaded, buffer);
          } catch (error) {
            // The original transparent photograph stays visible if Rive cannot load.
            if (!cancelled) { console.warn('Statue animation unavailable', error); fallback(); }
          }
        }, () => {});
      }
      sync();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      maybeStart();
    });
    observer.observe(container);
    const resize = new ResizeObserver(() => {
      for (const rive of instances) rive.resizeDrawingSurfaceToCanvas(Math.min(devicePixelRatio, 1.5));
    });
    resize.observe(container);
    const hidePage = () => {
      pageHidden = true;
      cancelAnimationFrame(revealFrame);
      clearTimeout(chargeTimer);
      revealFrame = 0;
      container.dataset.surface = 'loading';
      sync();
    };
    const showPage = () => {
      pageHidden = false;
      maybeStart();
    };
    // React does not unmount on navigation. Hide the outgoing surface before
    // the browser releases its GPU resources; resume after a bfcache restore.
    window.addEventListener('pagehide', hidePage);
    window.addEventListener('pageshow', showPage);
    document.addEventListener('visibilitychange', sync);
    const onScroll = () => {
      if (!scrolling) { scrolling = true; sync(); }
      clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => { scrolling = false; sync(); }, 250);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    motion.addEventListener('change', maybeStart);
    desktop.addEventListener('change', maybeStart);
    return () => {
      cancelled = true;
      abort.abort();
      clearTimeout(fallbackTimer);
      clearTimeout(chargeTimer);
      cancelAnimationFrame(revealFrame);
      delete container.dataset.surface;
      delete container.dataset.charge;
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener('pagehide', hidePage);
      window.removeEventListener('pageshow', showPage);
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(scrollTimer);
      motion.removeEventListener('change', maybeStart);
      desktop.removeEventListener('change', maybeStart);
      for (const rive of instances) rive.cleanup();
    };
  }, [artwork, mode]);

  // Fresh canvases keep each artwork/look instance's lifecycle independent.
  return (
    <div
      ref={containerRef}
      className={`digital-statue ${className}`.trim()}
      aria-hidden="true"
      data-scene="loading"
      data-surface="loading"
      // Constant, so it is the same markup on the server and the client.
      style={{ '--statue-surface-glow': ULTRAMARINE_COLORS.accentBright } as CSSProperties}
    >
      <div className="digital-statue__img" role="presentation">
        <div className="digital-statue__surface">
          <canvas key={canvasKey} ref={surfaceRef} />
        </div>
        <div className="digital-statue__scan" />
      </div>
    </div>
  );
}
