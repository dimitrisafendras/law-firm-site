import { useEffect, useRef } from 'react';
import './DigitalFlame.css';

interface DigitalFlameProps {
  className?: string;
  /** 'blue' for digital flame, 'warm' for traditional flame */
  variant?: 'blue' | 'warm';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
}

const COLORS = {
  blue: {
    hot: [220, 245, 255],
    mid: [137, 207, 240],
    outer: [137, 207, 240],
    glow: [137, 207, 240],
  },
  warm: {
    hot: [255, 240, 200],
    mid: [255, 180, 80],
    outer: [255, 120, 40],
    glow: [255, 160, 60],
  },
};

function createParticle(w: number, h: number): Particle {
  return {
    x: w * 0.5 + (Math.random() - 0.5) * w * 0.3,
    y: h * 0.85 + Math.random() * h * 0.1,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -(0.5 + Math.random() * 1.2),
    size: 2 + Math.random() * 4,
    life: 0,
    maxLife: 30 + Math.random() * 40,
  };
}

export function DigitalFlame({ className = '', variant = 'blue' }: DigitalFlameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    const c = COLORS[variant];

    function resize() {
      const wrap = canvas!.parentElement!;
      const rect = wrap.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;

      ctx!.clearRect(0, 0, w, h);

      // Spawn particles
      if (particles.length < 50) {
        particles.push(createParticle(w, h));
        if (Math.random() > 0.5) particles.push(createParticle(w, h));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx + (Math.random() - 0.5) * 0.3;
        p.y += p.vy;
        p.vy *= 0.98;
        p.vx *= 0.99;
        p.size *= 0.985;

        const progress = p.life / p.maxLife;

        if (progress >= 1 || p.size < 0.3) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = Math.sin(progress * Math.PI);
        let rgb: number[];
        let a: number;

        if (progress < 0.3) {
          rgb = c.hot;
          a = alpha * 0.9;
        } else if (progress < 0.6) {
          rgb = c.mid;
          a = alpha * 0.7;
        } else {
          rgb = c.outer;
          a = alpha * 0.3;
        }

        ctx!.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;
        ctx!.beginPath();
        ctx!.ellipse(p.x, p.y, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Base glow
      const gradient = ctx!.createRadialGradient(w * 0.5, h * 0.8, 0, w * 0.5, h * 0.8, w * 0.4);
      gradient.addColorStop(0, `rgba(${c.glow[0]}, ${c.glow[1]}, ${c.glow[2]}, 0.15)`);
      gradient.addColorStop(1, `rgba(${c.glow[0]}, ${c.glow[1]}, ${c.glow[2]}, 0)`);
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [variant]);

  return (
    <div className={`digital-flame ${className}`.trim()} aria-hidden="true">
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, display: 'block' }} />
    </div>
  );
}
