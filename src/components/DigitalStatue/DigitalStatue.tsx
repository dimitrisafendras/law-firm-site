import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { breakpoints, resolveStatue } from '@/theme';
import { useTheme } from '@/lib/theme';
import { artworkFor } from './statueArtwork';
// The Rive mesh is baked in this blue whichever statue shows (see
// scripts/build-hero-rive.mjs), so its entrance scan is too.
import { ULTRAMARINE_COLORS } from './sceneColors';
import riveWasm from '@rive-app/webgl2/rive.wasm?url';
import type { StatueWorkerMessage } from './statue.worker';
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

// The light layer joins as the hero's entrance ends: the page's finite
// document-timeline animations (scroll-driven ones never finish and are
// excluded). Rive itself warms up in a worker meanwhile (statue.worker.ts), so
// by then it is normally ready and the light starts as the last word lands.
function afterEntrances(signal: AbortSignal): Promise<void> {
  const running = (document.getAnimations?.() ?? []).filter(animation =>
    animation.timeline === document.timeline &&
    animation.playState === 'running' &&
    animation.effect?.getTiming().iterations !== Infinity);
  const settled = Promise.allSettled(running.map(animation => animation.finished));
  const cap = new Promise(resolve => setTimeout(resolve, 4000));
  return Promise.race([settled, cap]).then(() => new Promise<void>(resolve => {
    if (!signal.aborted) resolve();
  }));
}

// The worker draws straight into the page's canvas. Without OffscreenCanvas
// there is no light layer, only the photograph — which is the whole figure.
const offscreenSupported = () =>
  typeof Worker !== 'undefined' && typeof HTMLCanvasElement !== 'undefined' &&
  'transferControlToOffscreen' in HTMLCanvasElement.prototype;

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
    let worker: Worker | null = null;
    let cancelled = false;
    let started = false;
    let inView = false;
    let warm = false;
    let entered = false;
    let pageHidden = false;
    let playing = false;
    // The light pauses for the length of a scroll. It used to be because each
    // frame made the main thread wait on the GPU; in the worker it does not,
    // but the GPU is still shared with the first paint of every glass-heavy
    // section, and the ambient light is slow enough that holding it is
    // invisible.
    let scrolling = false;
    let scrollTimer = 0;
    const abort = new AbortController();
    container.dataset.scene = 'loading';
    container.dataset.surface = 'loading';
    const imageReady = decodeArtwork(container.querySelector('.digital-statue__img')!);
    // Attach a rejection handler immediately while the runtime is loading.
    void imageReady.catch(() => {});
    const reveal = () => {
      if (!cancelled && !pageHidden) container.dataset.scene = 'ready';
    };
    const send = (message: StatueWorkerMessage, transfer: Transferable[] = []) => worker?.postMessage(message, transfer);
    const sync = () => {
      const next = warm && entered && !pageHidden && !scrolling && container.dataset.surface === 'ready' &&
        inView && !document.hidden && !motion.matches && desktop.matches;
      if (next !== playing) { playing = next; send({ type: 'run', playing }); }
    };
    const fallback = () => {
      if (cancelled) return;
      container.dataset.surface = 'failed';
      clearTimeout(fallbackTimer);
      sync();
      reveal();
    };
    // A failed or stalled runtime must never leave the photograph hidden.
    const fallbackTimer = window.setTimeout(fallback, 10000);
    // The glare and the light it switches on are one event: the band climbs
    // the figure and the live mesh appears right behind it. Both wait for the
    // entrance to finish and for the worker to be rendering smoothly.
    const lightUp = () => {
      if (cancelled || pageHidden || !warm || !entered || container.dataset.surface === 'failed') return;
      clearTimeout(fallbackTimer);
      container.dataset.charge = 'on';
      container.dataset.surface = 'ready';
      reveal();
      sync();
    };
    const drawingSize = () => {
      const box = surfaceRef.current!.getBoundingClientRect();
      const scale = Math.min(devicePixelRatio, 1.5);
      return { width: Math.max(1, Math.round(box.width * scale)), height: Math.max(1, Math.round(box.height * scale)) };
    };
    const start = () => {
      const canvas = surfaceRef.current;
      if (!canvas || !offscreenSupported()) { fallback(); return; }
      try {
        const target = canvas.transferControlToOffscreen();
        worker = new Worker(new URL('./statue.worker.ts', import.meta.url), { type: 'module' });
        worker.onmessage = ({ data }: MessageEvent<{ type: 'warm' } | { type: 'error'; message: string }>) => {
          if (data.type === 'warm') { warm = true; lightUp(); }
          else { console.warn('Statue animation unavailable', data.message); fallback(); }
        };
        worker.onerror = event => { console.warn('Statue animation unavailable', event.message); fallback(); };
        send({
          type: 'init',
          canvas: target,
          riv: new URL(`${import.meta.env.BASE_URL}animations/hero.riv`, location.href).href,
          wasm: new URL(riveWasm, location.href).href,
          ...drawingSize(),
        }, [target]);
      } catch (error) {
        console.warn('Statue animation unavailable', error);
        fallback();
      }
    };
    const maybeStart = () => {
      // The photograph enters on its own schedule; the light layer joins it
      // as the entrance ends (see afterEntrances).
      void imageReady.then(reveal).catch(fallback);
      if (mode === 'classic' || motion.matches || !desktop.matches) clearTimeout(fallbackTimer);
      if (!started && mode !== 'classic' && !motion.matches && desktop.matches && inView) {
        started = true;
        // Off the main thread, so it starts now and warms up under the entrance.
        start();
        void imageReady.then(() => afterEntrances(abort.signal)).then(() => {
          entered = true;
          lightUp();
        }, () => {});
      }
      lightUp();
      sync();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      maybeStart();
    });
    observer.observe(container);
    const resize = new ResizeObserver(() => {
      if (worker) send({ type: 'resize', ...drawingSize() });
    });
    resize.observe(container);
    const hidePage = () => {
      pageHidden = true;
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
      worker?.terminate();
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
