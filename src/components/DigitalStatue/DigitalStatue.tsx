import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const fontSize = 8;
    let startCol: number;
    let endCol: number;
    let startRow: number;
    let maxRow: number;
    let drops: { y: number; speed: number; chars: string[] }[];

    function resize() {
      const rect = container!.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;

      const columns = Math.floor(rect.width / fontSize);
      const rows = Math.floor(rect.height / fontSize);

      // Rain on the left 40% of the container (the digital side of the statue)
      startCol = 0;
      endCol = Math.floor(columns * 0.40);
      startRow = 0;
      maxRow = rows;

      const count = Math.max(1, endCol - startCol);
      drops = Array.from({ length: count }, () => ({
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

      const count = endCol - startCol;
      for (let i = 0; i < count; i++) {
        const drop = drops[i];
        const x = (startCol + i) * fontSize;

        for (let j = 0; j < TRAIL_LENGTH; j++) {
          const row = Math.floor(drop.y) - j;
          if (row < startRow) continue;
          const yPx = row * fontSize;
          if (yPx > canvas!.height) continue;

          const fade = 1 - j / TRAIL_LENGTH;
          if (j === 0) {
            ctx!.fillStyle = `rgba(188, 232, 255, ${0.9 * fade})`;
          } else {
            ctx!.fillStyle = `rgba(137, 207, 240, ${0.7 * fade})`;
          }
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
      <canvas ref={canvasRef} className="digital-statue__rain" aria-hidden="true" />
      <img src={statueImg} alt="" className="digital-statue__img" />
    </div>
  );
}
