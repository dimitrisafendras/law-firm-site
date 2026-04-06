import { useEffect, useRef } from 'react';
import statueImg from '@/assets/images/hero-statue.png';
import RainWorkerUrl from './rainWorker.ts?worker&url';
import SparkleWorkerUrl from './sparkleWorker.ts?worker&url';
import FlameWorkerUrl from './flameWorker.ts?worker&url';
import './DigitalStatue.css';

// ── Pre-render rain sprite sheet (main thread, once) ─────────────────────────
const FONT_SIZE = 10;
const TRAIL = 12;
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

// ── Pre-render star sprite (main thread, once) ───────────────────────────────
function createStarSprite(): Promise<ImageBitmap> {
  const SIZE = 32;
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
function spawnWorker(
  url: string,
  canvas: HTMLCanvasElement,
  initMsg: Record<string, unknown>,
): Worker | null {
  try {
    // Set canvas pixel dimensions to match its CSS container BEFORE transferring
    const wrap = canvas.parentElement!;
    const rect = wrap.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    canvas.width = w;
    canvas.height = h;

    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(url, { type: 'module' });
    worker.postMessage({ type: 'init', canvas: offscreen, width: w, height: h, ...initMsg }, [offscreen]);
    return worker;
  } catch {
    return null;
  }
}

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

    const workers: Worker[] = [];
    let observer: IntersectionObserver | null = null;
    let cancelled = false;

    async function start() {
      // Pre-render sprites on main thread
      const [rainSprite, starSprite] = await Promise.all([createRainSprite(), createStarSprite()]);
      if (cancelled) return;

      // Rain worker
      if (rainRef.current) {
        const w = spawnWorker(RainWorkerUrl, rainRef.current, { sprite: rainSprite });
        if (w) workers.push(w);
      }

      // Sparkle body worker
      if (spkBodyRef.current) {
        const w = spawnWorker(SparkleWorkerUrl, spkBodyRef.current, { sprite: starSprite, count: 70, speed: 0.2 });
        if (w) workers.push(w);
      }

      // Sparkle scale worker
      if (spkScaleRef.current) {
        const w = spawnWorker(SparkleWorkerUrl, spkScaleRef.current, { sprite: starSprite, count: 20, speed: 0.2 });
        if (w) workers.push(w);
      }

      // Flame left worker
      if (flameLRef.current) {
        const w = spawnWorker(FlameWorkerUrl, flameLRef.current, { wMul: 0.4, hMul: 1,
          colors: { hot: '220,245,255', mid: '137,207,240', outer: '137,207,240', glow: '137,207,240' },
        });
        if (w) workers.push(w);
      }

      // Flame right worker
      if (flameRRef.current) {
        const w = spawnWorker(FlameWorkerUrl, flameRRef.current, {
          wMul: 0.4, hMul: 1,
          colors: { hot: '255,240,200', mid: '255,180,80', outer: '255,120,40', glow: '255,160,60' },
        });
        if (w) workers.push(w);
      }

      // Visibility observer — pause/resume all workers
      observer = new IntersectionObserver(([entry]) => {
        for (const w of workers) w.postMessage({ type: 'visibility', visible: entry.isIntersecting });
      }, { threshold: 0 });
      observer.observe(container!);
    }

    // Try immediately; if container has no size yet, retry on resize
    // (the <img onLoad> dispatches a resize event once it loads)
    let started = false;
    async function tryStart() {
      if (started || cancelled) return;
      const rect = container!.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      started = true;
      window.removeEventListener('resize', tryStart);
      await start();
    }

    tryStart();
    window.addEventListener('resize', tryStart);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', tryStart);
      observer?.disconnect();
      for (const w of workers) w.terminate();
    };
  }, []);

  return (
    <div ref={containerRef} className={`digital-statue ${className}`.trim()}>
      {/* Back layer: rain + flames (behind statue) */}
      <div className="digital-statue__rain-wrap">
        <canvas ref={rainRef} className="digital-statue__rain" />
      </div>

      <img
        src={statueImg}
        alt=""
        className="digital-statue__img"
        onLoad={() => window.dispatchEvent(new Event('resize'))}
      />

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
