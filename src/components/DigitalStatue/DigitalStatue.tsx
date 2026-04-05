import { useEffect, useRef } from 'react';
import statueImg from '@/assets/images/hero-acropolis.png';
import './DigitalStatue.css';

const CHARS = '01';
const TRAIL_LENGTH = 12;
const SPARKLE_COUNT = 25;

interface DigitalStatueProps {
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

export function DigitalStatue({ className = '' }: DigitalStatueProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparkleRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const fontSize = 10;
    let startCol: number;
    let endCol: number;
    let maxRow: number;
    let drops: { y: number; speed: number; chars: string[] }[];

    function resize() {
      const wrap = canvas!.parentElement!;
      const rect = wrap.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;

      const columns = Math.floor(rect.width / fontSize);
      const rows = Math.floor(rect.height / fontSize);

      startCol = 0;
      endCol = columns;
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
          if (row < 0) continue;
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

  // Sparkle effect
  useEffect(() => {
    const canvas = sparkleRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let sparkles: Sparkle[] = [];

    function randomSparkle(): Sparkle {
      // Two zones: digital body (left 20-60%) and left scale basket (65-75%, 20-40%)
      const inBasket = Math.random() < 0.25;
      return {
        x: inBasket ? 0.65 + Math.random() * 0.10 : 0.20 + Math.random() * 0.40,
        y: inBasket ? 0.20 + Math.random() * 0.20 : 0.05 + Math.random() * 0.85,
        size: 1 + Math.random() * 2.5,
        opacity: 0,
        fadeSpeed: 0.005 + Math.random() * 0.015,
        delay: Math.random() * 200,
        age: 0,
      };
    }

    function resize() {
      const rect = container!.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;
      sparkles = Array.from({ length: SPARKLE_COUNT }, randomSparkle);
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const s of sparkles) {
        s.age++;
        if (s.age < s.delay) continue;

        // Pulse: fade in then fade out
        s.opacity += s.fadeSpeed;
        if (s.opacity > 1) {
          s.opacity = 1;
          s.fadeSpeed = -Math.abs(s.fadeSpeed);
        }
        if (s.opacity <= 0) {
          // Reset sparkle
          Object.assign(s, randomSparkle());
          continue;
        }

        const px = s.x * canvas!.width;
        const py = s.y * canvas!.height;

        const r = s.size;

        // Soft glow
        ctx!.beginPath();
        ctx!.arc(px, py, r * 4, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(188, 232, 255, ${s.opacity * 0.1})`;
        ctx!.fill();

        // 4-point star shape
        ctx!.save();
        ctx!.translate(px, py);
        ctx!.fillStyle = `rgba(220, 245, 255, ${s.opacity * 0.9})`;
        ctx!.beginPath();
        // Vertical spike
        ctx!.moveTo(0, -r * 3);
        ctx!.lineTo(r * 0.3, -r * 0.3);
        ctx!.lineTo(0, 0);
        ctx!.lineTo(-r * 0.3, -r * 0.3);
        ctx!.closePath();
        ctx!.fill();
        ctx!.beginPath();
        ctx!.moveTo(0, r * 3);
        ctx!.lineTo(r * 0.3, r * 0.3);
        ctx!.lineTo(0, 0);
        ctx!.lineTo(-r * 0.3, r * 0.3);
        ctx!.closePath();
        ctx!.fill();
        // Horizontal spike
        ctx!.beginPath();
        ctx!.moveTo(-r * 3, 0);
        ctx!.lineTo(-r * 0.3, r * 0.3);
        ctx!.lineTo(0, 0);
        ctx!.lineTo(-r * 0.3, -r * 0.3);
        ctx!.closePath();
        ctx!.fill();
        ctx!.beginPath();
        ctx!.moveTo(r * 3, 0);
        ctx!.lineTo(r * 0.3, -r * 0.3);
        ctx!.lineTo(0, 0);
        ctx!.lineTo(r * 0.3, r * 0.3);
        ctx!.closePath();
        ctx!.fill();

        // Bright center dot
        ctx!.beginPath();
        ctx!.arc(0, 0, r * 0.5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx!.fill();
        ctx!.restore();
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
      <canvas ref={sparkleRef} className="digital-statue__sparkles" aria-hidden="true" />
    </div>
  );
}
