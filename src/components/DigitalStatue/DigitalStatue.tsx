import { useEffect, useRef } from 'react';
import { Sparkles } from '@/components/Sparkles/Sparkles';
import { DigitalFlame } from '@/components/DigitalFlame/DigitalFlame';
import { registerDraw } from './animationLoop';
import statueImg from '@/assets/images/hero-acropolis.png';
import './DigitalStatue.css';

const CHARS = '01';
const TRAIL_LENGTH = 12;

// Pre-compute rain fill styles (avoids template literal in hot loop)
const RAIN_COLORS: string[] = [];
for (let j = 0; j < TRAIL_LENGTH; j++) {
  const fade = 1 - j / TRAIL_LENGTH;
  RAIN_COLORS[j] = j === 0
    ? `rgba(188,232,255,${(0.9 * fade).toFixed(3)})`
    : `rgba(137,207,240,${(0.7 * fade).toFixed(3)})`;
}

interface DigitalStatueProps {
  className?: string;
}

export function DigitalStatue({ className = '' }: DigitalStatueProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d')!;
    const fontSize = 10;
    let endCol: number;
    let maxRow: number;
    let drops: { y: number; speed: number; chars: string[] }[];

    function resize() {
      const wrap = canvas!.parentElement!;
      const rect = wrap.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;

      const columns = Math.floor(rect.width / fontSize);
      endCol = columns;
      maxRow = Math.floor(rect.height / fontSize);

      drops = Array.from({ length: Math.max(1, endCol) }, () => ({
        y: Math.random() * -30,
        speed: 0.1 + Math.random() * 0.15,
        chars: Array.from({ length: TRAIL_LENGTH }, () => CHARS[(Math.random() * 2) | 0]),
      }));
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      if (!visibleRef.current) return;

      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < endCol; i++) {
        const drop = drops[i];
        const x = i * fontSize;

        for (let j = 0; j < TRAIL_LENGTH; j++) {
          const row = (drop.y | 0) - j;
          if (row < 0) continue;
          const yPx = row * fontSize;
          if (yPx > canvas!.height) continue;

          ctx.fillStyle = RAIN_COLORS[j];
          ctx.fillText(drop.chars[j], x, yPx);
        }

        drop.y += drop.speed;

        if (Math.random() > 0.92) {
          drop.chars[(Math.random() * TRAIL_LENGTH) | 0] = CHARS[(Math.random() * 2) | 0];
        }
        if (drop.y - TRAIL_LENGTH > maxRow && Math.random() > 0.97) {
          drop.y = 0;
          drop.speed = 0.1 + Math.random() * 0.15;
        }
      }
    }

    const unregister = registerDraw(draw);

    // Pause when hero scrolls off-screen
    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 },
    );
    observer.observe(container);

    return () => {
      unregister();
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`digital-statue ${className}`.trim()}>
      <div className="digital-statue__rain-wrap">
        <canvas ref={canvasRef} className="digital-statue__rain" aria-hidden="true" />
      </div>
      <img
        src={statueImg}
        alt=""
        className="digital-statue__img"
        onLoad={() => window.dispatchEvent(new Event('resize'))}
      />
      <Sparkles speed={0.4} count={70} className="digital-statue__sparkles-wrap digital-statue__sparkles-body" />
      <Sparkles speed={0.4} count={20} className="digital-statue__sparkles-wrap digital-statue__sparkles-scale" />
      <DigitalFlame width={0.4} variant="blue" className="digital-statue__flame digital-statue__flame--left" />
      <DigitalFlame width={0.4} variant="warm" className="digital-statue__flame digital-statue__flame--right" />
    </div>
  );
}
