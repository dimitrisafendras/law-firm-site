import { useEffect, useRef } from 'react';

interface SparklesProps {
  /** Number of sparkles */
  count?: number;
  /** Min size of sparkle (default 0.5) */
  minSize?: number;
  /** Max size of sparkle (default 1.7) */
  maxSize?: number;
  /** Fade speed multiplier — higher = faster pulse (default 1) */
  speed?: number;
  /** CSS class for the wrapper div (use to position & size) */
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

function drawStar(ctx: CanvasRenderingContext2D, px: number, py: number, r: number, opacity: number) {
  // Soft glow
  ctx.beginPath();
  ctx.arc(px, py, r * 4, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(188, 232, 255, ${opacity * 0.1})`;
  ctx.fill();

  // 4-point star
  ctx.save();
  ctx.translate(px, py);
  ctx.fillStyle = `rgba(220, 245, 255, ${opacity * 0.9})`;

  // Vertical spikes
  ctx.beginPath();
  ctx.moveTo(0, -r * 3);
  ctx.lineTo(r * 0.3, -r * 0.3);
  ctx.lineTo(0, 0);
  ctx.lineTo(-r * 0.3, -r * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, r * 3);
  ctx.lineTo(r * 0.3, r * 0.3);
  ctx.lineTo(0, 0);
  ctx.lineTo(-r * 0.3, r * 0.3);
  ctx.closePath();
  ctx.fill();

  // Horizontal spikes
  ctx.beginPath();
  ctx.moveTo(-r * 3, 0);
  ctx.lineTo(-r * 0.3, r * 0.3);
  ctx.lineTo(0, 0);
  ctx.lineTo(-r * 0.3, -r * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(r * 3, 0);
  ctx.lineTo(r * 0.3, -r * 0.3);
  ctx.lineTo(0, 0);
  ctx.lineTo(r * 0.3, r * 0.3);
  ctx.closePath();
  ctx.fill();

  // Bright center
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  ctx.fill();
  ctx.restore();
}

export function Sparkles({ count = 20, minSize = 0.5, maxSize = 1.7, speed = 1, className = '' }: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let sparkles: Sparkle[] = [];

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

    function resize() {
      const wrap = canvas!.parentElement!;
      const rect = wrap.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;
      sparkles = Array.from({ length: count }, makeSparkle);
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const s of sparkles) {
        s.age++;
        if (s.age < s.delay) continue;

        s.opacity += s.fadeSpeed;
        if (s.opacity > 1) {
          s.opacity = 1;
          s.fadeSpeed = -Math.abs(s.fadeSpeed);
        }
        if (s.opacity <= 0) {
          Object.assign(s, makeSparkle());
          continue;
        }

        drawStar(ctx!, s.x * canvas!.width, s.y * canvas!.height, s.size, s.opacity);
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [count, minSize, maxSize, speed]);

  return (
    <div className={className} style={{ overflow: 'hidden', position: 'absolute' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, display: 'block' }} aria-hidden="true" />
    </div>
  );
}
