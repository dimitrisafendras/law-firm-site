import { useEffect, useRef } from 'react';
import { registerDraw, QUALITY } from '@/components/DigitalStatue/animationLoop';

interface SparklesProps {
  count?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  className?: string;
}

interface Sparkle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  fadeSpeed: number;
  delay: number;
  age: number;
}

// Pre-rendered star sprite (drawn once, reused via drawImage)
const SPRITE_SIZE = 32;
let starSprite: HTMLCanvasElement | null = null;

function getStarSprite(): HTMLCanvasElement {
  if (starSprite) return starSprite;
  starSprite = document.createElement('canvas');
  starSprite.width = SPRITE_SIZE;
  starSprite.height = SPRITE_SIZE;
  const c = starSprite.getContext('2d')!;
  const cx = SPRITE_SIZE / 2;
  const r = SPRITE_SIZE / 2;

  // Glow
  c.beginPath();
  c.arc(cx, cx, r, 0, Math.PI * 2);
  c.fillStyle = 'rgba(188,232,255,0.1)';
  c.fill();

  // 4-point star spikes
  c.fillStyle = 'rgba(220,245,255,0.9)';
  const s = r * 0.25;
  const l = r * 0.9;
  c.beginPath(); c.moveTo(cx, cx - l); c.lineTo(cx + s, cx - s); c.lineTo(cx, cx); c.lineTo(cx - s, cx - s); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(cx, cx + l); c.lineTo(cx + s, cx + s); c.lineTo(cx, cx); c.lineTo(cx - s, cx + s); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(cx - l, cx); c.lineTo(cx - s, cx + s); c.lineTo(cx, cx); c.lineTo(cx - s, cx - s); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(cx + l, cx); c.lineTo(cx + s, cx - s); c.lineTo(cx, cx); c.lineTo(cx + s, cx + s); c.closePath(); c.fill();

  // Bright center
  c.beginPath();
  c.arc(cx, cx, r * 0.15, 0, Math.PI * 2);
  c.fillStyle = 'rgba(255,255,255,1)';
  c.fill();

  return starSprite;
}

export function Sparkles({ count = 20, minSize = 0.5, maxSize = 1.7, speed = 1, className = '' }: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let sparkles: Sparkle[] = [];
    const sprite = getStarSprite();

    function makeSparkle(): Sparkle {
      return {
        x: Math.random(),
        y: Math.random(),
        size: minSize + Math.random() * (maxSize - minSize),
        opacity: 0,
        fadeSpeed: (0.015 + Math.random() * 0.03) * speed,
        delay: Math.random() * 80,
        age: 0,
      };
    }

    const effectiveCount = Math.round(count * QUALITY);

    function resize() {
      const wrap = canvas!.parentElement!;
      const rect = wrap.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;
      sparkles = Array.from({ length: effectiveCount }, makeSparkle);
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      if (!visibleRef.current) return;

      const w = canvas!.width;
      const h = canvas!.height;
      ctx.clearRect(0, 0, w, h);

      for (const s of sparkles) {
        s.age++;
        if (s.age < s.delay) continue;

        s.opacity += s.fadeSpeed;
        if (s.opacity > 1) { s.opacity = 1; s.fadeSpeed = -Math.abs(s.fadeSpeed); }
        if (s.opacity <= 0) { Object.assign(s, makeSparkle()); continue; }

        const drawSize = s.size * 6;
        ctx.globalAlpha = s.opacity;
        ctx.drawImage(sprite, s.x * w - drawSize / 2, s.y * h - drawSize / 2, drawSize, drawSize);
      }
      ctx.globalAlpha = 1;
    }

    const unregister = registerDraw(draw);

    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 },
    );
    observer.observe(canvas.parentElement!);

    return () => {
      unregister();
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, [count, minSize, maxSize, speed]);

  return (
    <div className={className} style={{ overflow: 'hidden', position: 'absolute' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, display: 'block' }} aria-hidden="true" />
    </div>
  );
}
