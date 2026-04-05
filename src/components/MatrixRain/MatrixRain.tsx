import { useEffect, useRef } from 'react';

interface MatrixRainProps {
  className?: string;
}

const CHARS = '01';

export function MatrixRain({ className = '' }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const fontSize = 14;
    let columns: number;
    let startCol: number;
    let endCol: number;
    let drops: number[];

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
      columns = Math.floor(canvas!.width / fontSize);
      // Rain from 30% to 65% of the canvas width (left side of statue)
      startCol = Math.floor(columns * 0.30);
      endCol = Math.floor(columns * 0.65);
      const count = endCol - startCol;
      drops = Array(count).fill(0).map(() => Math.random() * -80);
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx!.fillStyle = 'rgba(17, 19, 23, 0.04)';
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      ctx!.font = `${fontSize}px monospace`;

      const count = endCol - startCol;
      for (let i = 0; i < count; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = (startCol + i) * fontSize;
        const y = drops[i] * fontSize;

        // Bright baby blue
        const opacity = 0.5 + Math.random() * 0.4;
        ctx!.fillStyle = `rgba(137, 207, 240, ${opacity})`;
        ctx!.fillText(char, x, y);

        // Extra bright head character
        if (Math.random() > 0.85) {
          ctx!.fillStyle = 'rgba(188, 232, 255, 0.95)';
          ctx!.fillText(char, x, y);
        }

        if (y > canvas!.height && Math.random() > 0.97) {
          drops[i] = 0;
        }
        // Slow speed
        drops[i] += 0.2 + Math.random() * 0.3;
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
