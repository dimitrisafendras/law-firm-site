import { useEffect, useRef } from 'react';
import { registerDraw, QUALITY } from '@/components/DigitalStatue/animationLoop';
import './DigitalFlame.css';

interface DigitalFlameProps {
  className?: string;
  variant?: 'blue' | 'warm';
  height?: number;
  width?: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; life: number; maxLife: number; alive: boolean;
}

const MAX_PARTICLES = 60;

const COLORS = {
  blue: { hot: [220, 245, 255], mid: [137, 207, 240], outer: [137, 207, 240], glow: [137, 207, 240] },
  warm: { hot: [255, 240, 200], mid: [255, 180, 80], outer: [255, 120, 40], glow: [255, 160, 60] },
};

// Pre-compute color strings for each variant + phase
const FLAME_STYLES: Record<string, { hot: string; mid: string; outer: string }> = {};
for (const [key, c] of Object.entries(COLORS)) {
  FLAME_STYLES[key] = {
    hot: `${c.hot[0]},${c.hot[1]},${c.hot[2]}`,
    mid: `${c.mid[0]},${c.mid[1]},${c.mid[2]}`,
    outer: `${c.outer[0]},${c.outer[1]},${c.outer[2]}`,
  };
}

function resetParticle(p: Particle, w: number, h: number, wS: number, hS: number) {
  p.x = w * 0.5 + (Math.random() - 0.5) * w * 0.3 * wS;
  p.y = h * 0.85 + Math.random() * h * 0.1;
  p.vx = (Math.random() - 0.5) * 0.4 * wS;
  p.vy = -(0.5 + Math.random() * 1.2) * hS;
  p.size = (2 + Math.random() * 4) * Math.max(wS, hS);
  p.life = 0;
  p.maxLife = (30 + Math.random() * 40) * hS;
  p.alive = true;
}

export function DigitalFlame({ className = '', variant = 'blue', height: hMul = 1, width: wMul = 1 }: DigitalFlameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const styles = FLAME_STYLES[variant];
    const c = COLORS[variant];

    const poolSize = Math.round(MAX_PARTICLES * QUALITY);
    const particles: Particle[] = Array.from({ length: poolSize }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, size: 0, life: 0, maxLife: 1, alive: false,
    }));

    // Cached gradient (rebuilt on resize)
    let glowGrad: CanvasGradient | null = null;

    function resize() {
      const wrap = canvas!.parentElement!;
      const rect = wrap.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;

      // Re-build gradient once
      const w = rect.width, h = rect.height;
      glowGrad = ctx.createRadialGradient(w * 0.5, h * 0.8, 0, w * 0.5, h * 0.8, w * 0.4);
      glowGrad.addColorStop(0, `rgba(${c.glow[0]},${c.glow[1]},${c.glow[2]},0.15)`);
      glowGrad.addColorStop(1, `rgba(${c.glow[0]},${c.glow[1]},${c.glow[2]},0)`);
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      if (!visibleRef.current) return;

      const w = canvas!.width;
      const h = canvas!.height;
      ctx.clearRect(0, 0, w, h);

      // Spawn into dead slots
      let spawned = 0;
      for (const p of particles) {
        if (spawned >= 3) break;
        if (!p.alive) {
          resetParticle(p, w, h, wMul, hMul);
          spawned++;
        }
      }

      for (const p of particles) {
        if (!p.alive) continue;
        p.life++;
        p.x += p.vx + (Math.random() - 0.5) * 0.3;
        p.y += p.vy;
        p.vy *= 0.98;
        p.vx *= 0.99;
        p.size *= 0.988;

        const progress = p.life / p.maxLife;
        if (progress >= 1 || p.size < 0.2) { p.alive = false; continue; }

        const alpha = Math.sin(progress * Math.PI);
        let rgb: string;
        let a: number;
        if (progress < 0.3) { rgb = styles.hot; a = alpha * 0.9; }
        else if (progress < 0.6) { rgb = styles.mid; a = alpha * 0.7; }
        else { rgb = styles.outer; a = alpha * 0.3; }

        ctx.fillStyle = `rgba(${rgb},${a.toFixed(2)})`;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      if (glowGrad) {
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, w, h);
      }
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
  }, [variant, hMul, wMul]);

  return (
    <div className={`digital-flame ${className}`.trim()} aria-hidden="true">
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, display: 'block' }} />
    </div>
  );
}
