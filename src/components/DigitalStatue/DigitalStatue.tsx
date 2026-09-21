import { useEffect, useRef } from 'react';
import { breakpoints, resolveStatue } from '@/theme';
import { useTheme } from '@/lib/theme';
import { artworkFor } from './statueArtwork';
import type { Rive } from '@rive-app/webgl2';
import riveWasm from '@rive-app/webgl2/rive.wasm?url';
import './DigitalStatue.css';

// Art lighting, deliberately independent of the page palette.
const mobileBreakpoint = parseInt(breakpoints.mobile, 10);
// Most negative spaces are between 24–49% of the source image's width.
const ambientParticles = [19, 24, 29, 34, 39, 44, 49, 54, 59, 64, 69, 74, 79, 31, 42, 51, 62, 71, 22, 37, 57, 76] as const;

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
    const sync = () => {
      container.style.setProperty('--ambient-play-state',
        inView && !document.hidden && !motion.matches && desktop.matches ? 'running' : 'paused');
      for (const rive of instances) {
        if (inView && !document.hidden && !motion.matches && desktop.matches) rive.play('Ambient');
        else rive.pause();
      }
    };
    const add = (canvas: HTMLCanvasElement | null, artboard: string, buffer: ArrayBuffer) => {
      if (!canvas || cancelled) return;
      const { Rive, Layout, Fit, Alignment, DrawOptimizationOptions } = runtime;
      const rive = new Rive({
        canvas, buffer, artboard, stateMachine: 'Ambient', autoplay: false,
        layout: new Layout({ fit: Fit.Fill, alignment: Alignment.Center }),
        // Ambient opacity changes are deliberately tiny. Present each active
        // frame rather than relying on the runtime's dirty-scene heuristic.
        drawingOptions: DrawOptimizationOptions.AlwaysDraw,
        shouldDisableRiveListeners: true, enableRiveAssetCDN: false,
        onLoad: () => { if (!cancelled) { rive.resizeDrawingSurfaceToCanvas(Math.min(devicePixelRatio, 1.5)); sync(); } },
      });
      instances.push(rive);
    };
    async function start() {
      try {
        runtime = await import('@rive-app/webgl2');
        if (cancelled) return;
        runtime.RuntimeLoader.setWasmUrl(riveWasm);
        runtime.RuntimeLoader.setWasmFallbackUrl(null);
        const response = await fetch(`${import.meta.env.BASE_URL}animations/hero.riv`);
        if (!response.ok) return;
        const buffer = await response.arrayBuffer();
        if (cancelled) return;
        if (!cancelled && surfaceRef.current) {
          add(surfaceRef.current, 'Mesh', buffer);
        }
      } catch (error) {
        // The original transparent photograph stays visible if Rive cannot load.
        console.warn('Statue animation unavailable', error);
      }
    }
    const maybeStart = () => {
      if (!started && mode !== 'classic' && !motion.matches && desktop.matches && inView) {
        started = true;
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
    <div ref={containerRef} className={`digital-statue ${className}`.trim()} aria-hidden="true">
      <div className="digital-statue__depth">
        {ambientParticles.map((left, i) => (
          <span key={left} style={{ left: `${left}%`, top: `${(i * 29) % 80}%`,
            width: `${2 + i % 3}px`, height: `${2 + i % 3}px`,
            animationDelay: `${-i * 2.3}s`, animationDirection: i % 2 ? 'alternate-reverse' : 'alternate',
            animationDuration: `${12 + (i % 5) * 2}s` }} />
        ))}
      </div>
      <div className="digital-statue__img" role="presentation">
        <div className="digital-statue__surface">
          <canvas key={canvasKey} ref={surfaceRef} />
        </div>
      </div>
    </div>
  );
}
