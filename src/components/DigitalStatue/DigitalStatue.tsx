import { useEffect, useRef } from 'react';
import { breakpoints, resolveStatue } from '@/theme';
import { useTheme } from '@/lib/theme';
import { artworkFor } from './statueArtwork';
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
    let revealFrame = 0;
    const abort = new AbortController();
    container.dataset.scene = 'loading';
    container.dataset.surface = 'loading';
    const imageReady = decodeArtwork(container.querySelector('.digital-statue__img')!);
    // Attach a rejection handler immediately while the runtime is loading.
    void imageReady.catch(() => {});
    const reveal = () => {
      if (!cancelled) container.dataset.scene = 'ready';
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
        if (assetsReady && container.dataset.surface !== 'failed' && inView && !document.hidden && !motion.matches && desktop.matches) rive.play('Ambient');
        else rive.pause();
      }
    };
    const add = (canvas: HTMLCanvasElement | null, artboard: string, buffer: ArrayBuffer) => {
      if (!canvas || cancelled) return;
      const { Rive, Layout, Fit, Alignment, DrawOptimizationOptions } = runtime;
      const images: Promise<void>[] = [];
      const rive = new Rive({
        canvas, buffer, artboard, stateMachine: 'Ambient', autoplay: false,
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
          if (!assetsReady || cancelled || revealFrame) return;
          // Advance fires before draw; reveal on the following presentation frame.
          revealFrame = requestAnimationFrame(() => {
            if (cancelled || container.dataset.surface === 'failed') return;
            clearTimeout(fallbackTimer);
            container.dataset.surface = 'ready';
            reveal();
          });
        },
      });
      instances.push(rive);
    };
    async function start() {
      try {
        runtime = await import('@rive-app/webgl2');
        if (cancelled) return;
        runtime.RuntimeLoader.setWasmUrl(riveWasm);
        runtime.RuntimeLoader.setWasmFallbackUrl(null);
        const response = await fetch(`${import.meta.env.BASE_URL}animations/hero.riv`, { signal: abort.signal });
        if (!response.ok) throw new Error(`Statue animation: HTTP ${response.status}`);
        const buffer = await response.arrayBuffer();
        if (cancelled) return;
        if (!cancelled && surfaceRef.current) {
          add(surfaceRef.current, 'Mesh', buffer);
        }
      } catch (error) {
        // The original transparent photograph stays visible if Rive cannot load.
        if (!cancelled) { console.warn('Statue animation unavailable', error); fallback(); }
      }
    }
    const maybeStart = () => {
      if (mode === 'classic' || motion.matches || !desktop.matches) {
        clearTimeout(fallbackTimer);
        void imageReady.then(reveal).catch(fallback);
      }
      if (!started && mode !== 'classic' && !motion.matches && desktop.matches && inView) {
        started = true;
        clearTimeout(fallbackTimer);
        fallbackTimer = window.setTimeout(fallback, 10000);
        void start();
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
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', maybeStart);
    desktop.addEventListener('change', maybeStart);
    return () => {
      cancelled = true;
      abort.abort();
      clearTimeout(fallbackTimer);
      cancelAnimationFrame(revealFrame);
      delete container.dataset.surface;
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', maybeStart);
      desktop.removeEventListener('change', maybeStart);
      for (const rive of instances) rive.cleanup();
    };
  }, [artwork, mode]);

  // Fresh canvases keep each artwork/look instance's lifecycle independent.
  return (
    <div ref={containerRef} className={`digital-statue ${className}`.trim()} aria-hidden="true" data-scene="loading" data-surface="loading">
      <div className="digital-statue__img" role="presentation">
        <div className="digital-statue__surface">
          <canvas key={canvasKey} ref={surfaceRef} />
        </div>
      </div>
    </div>
  );
}
