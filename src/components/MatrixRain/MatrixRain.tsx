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
    const fontSize = 10;
    let startCol: number;
    let endCol: number;
    let drops: { y: number; speed: number; chars: string[] }[];

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
      const columns = Math.floor(canvas!.width / fontSize);
      startCol = Math.floor(columns * 0.35);
      endCol = Math.floor(columns * 0.55);
      const count = endCol - startCol;
      drops = Array.from({ length: count }, () => ({
        y: Math.random() * -80,
        speed: 0.2 + Math.random() * 0.3,
        chars: Array.from({ length: TRAIL_LENGTH }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
      }));
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const x = (startCol + i) * fontSize;

        for (let j = 0; j < TRAIL_LENGTH; j++) {
          const row = Math.floor(drop.y) - j;
          if (row < 0) continue;
          const yPx = row * fontSize;
          if (yPx > canvas!.height) continue;

          // Fade trail: head is brightest, tail fades out
          const fade = 1 - j / TRAIL_LENGTH;
          if (j === 0) {
            ctx!.fillStyle = `rgba(188, 232, 255, ${0.9 * fade})`;
          } else {
            ctx!.fillStyle = `rgba(137, 207, 240, ${0.7 * fade})`;
          }
          ctx!.fillText(drop.chars[j], x, yPx);
        }

        drop.y += drop.speed;

        // Randomly swap a trail character
        if (Math.random() > 0.92) {
          const idx = Math.floor(Math.random() * TRAIL_LENGTH);
          drop.chars[idx] = CHARS[Math.floor(Math.random() * CHARS.length)];
        }

        // Reset when fully off screen
        const maxRow = canvas!.height / fontSize;
        if (drop.y - TRAIL_LENGTH > maxRow && Math.random() > 0.97) {
          drop.y = 0;
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
