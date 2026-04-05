import { useEffect, useRef } from 'react';
import { Sparkles } from '@/components/Sparkles/Sparkles';
import statueImg from '@/assets/images/hero-acropolis.png';
import './DigitalStatue.css';

const CHARS = '01';
const TRAIL_LENGTH = 12;

interface DigitalStatueProps {
  className?: string;
}

export function DigitalStatue({ className = '' }: DigitalStatueProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
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
        chars: Array.from({ length: TRAIL_LENGTH }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
      }));
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.font = `${fontSize}px monospace`;

      for (let i = 0; i < endCol; i++) {
        const drop = drops[i];
        const x = i * fontSize;

        for (let j = 0; j < TRAIL_LENGTH; j++) {
          const row = Math.floor(drop.y) - j;
          if (row < 0) continue;
          const yPx = row * fontSize;
          if (yPx > canvas!.height) continue;

          const fade = 1 - j / TRAIL_LENGTH;
          ctx!.fillStyle = j === 0
            ? `rgba(188, 232, 255, ${0.9 * fade})`
            : `rgba(137, 207, 240, ${0.7 * fade})`;
          ctx!.fillText(drop.chars[j], x, yPx);
        }

        drop.y += drop.speed;

        if (Math.random() > 0.92) {
          const idx = Math.floor(Math.random() * TRAIL_LENGTH);
          drop.chars[idx] = CHARS[Math.floor(Math.random() * CHARS.length)];
        }

        if (drop.y - TRAIL_LENGTH > maxRow && Math.random() > 0.97) {
          drop.y = 0;
          drop.speed = 0.1 + Math.random() * 0.15;
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div ref={containerRef} className={`digital-statue ${className}`.trim()}>
      <div className="digital-statue__rain-wrap">
        <canvas ref={canvasRef} className="digital-statue__rain" aria-hidden="true" />
      </div>
      <img src={statueImg} alt="" className="digital-statue__img" />
      <Sparkles speed={0.3} count={40} className="digital-statue__sparkles-wrap digital-statue__sparkles-body" />
      <Sparkles speed={0.4} count={20} className="digital-statue__sparkles-wrap digital-statue__sparkles-scale" />
    </div>
  );
}
