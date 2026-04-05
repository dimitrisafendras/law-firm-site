import { useEffect, useRef } from 'react';

interface MatrixRainProps {
  className?: string;
}

const CHARS = '01';
const TRAIL_LENGTH = 12;

export function MatrixRain({ className = '' }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const fontSize = 8;
    let startCol: number;
    let endCol: number;
    let startRow: number;
    let maxRow: number;
    let drops: { y: number; speed: number; chars: string[] }[];

    function getStatueMetrics() {
      const bg = document.querySelector('.hero-section__bg');
      const hero = document.querySelector('.hero-section');
      if (!bg || !hero) return { leftPct: 0.40, topPct: 0.10 };
      const bgRect = bg.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      return {
        leftPct: bgRect.left / heroRect.width,
        topPct: bgRect.top / heroRect.height,
      };
    }

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;

      const { leftPct, topPct } = getStatueMetrics();
      const columns = Math.floor(canvas!.width / fontSize);
      const rows = Math.floor(canvas!.height / fontSize);

      // Rain just to the left of the statue, ~10% wide, compact
      startCol = Math.floor(columns * Math.max(0, leftPct - 0.10));
      endCol = Math.floor(columns * leftPct);
      startRow = Math.floor(rows * topPct);
      maxRow = rows;

      const count = Math.max(1, endCol - startCol);
      drops = Array.from({ length: count }, () => ({
        y: startRow + Math.random() * -30,
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
          drop.y = startRow;
          drop.speed = 0.2 + Math.random() * 0.3;
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
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}
