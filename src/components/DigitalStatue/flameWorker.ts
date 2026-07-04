/// <reference lib="webworker" />
import { registerEffectWorker } from './effectWorkerHarness';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; life: number; maxLife: number; alive: boolean;
}

let MAX = 60;
let particles: Particle[] = [];
let wMul = 1, hMul = 1;
let hotColor = '220,245,255';
let midColor = '137,207,240';
let outerColor = '137,207,240';

function resetP(p: Particle, cw: number, ch: number) {
  p.x = cw * 0.5 + (Math.random() - 0.5) * cw * 0.3 * wMul;
  p.y = ch * 0.85 + Math.random() * ch * 0.1;
  p.vx = (Math.random() - 0.5) * 0.25 * wMul;
  p.vy = -(0.3 + Math.random() * 0.7) * hMul;
  p.size = (2 + Math.random() * 4) * Math.max(wMul, hMul);
  p.life = 0;
  p.maxLife = (30 + Math.random() * 40) * hMul;
  p.alive = true;
}

interface FlameInit {
  wMul?: number;
  hMul?: number;
  max?: number;
  colors?: { hot: string; mid: string; outer: string };
}

registerEffectWorker<FlameInit>({
  init(data) {
    wMul = data.wMul || 1;
    hMul = data.hMul || 1;
    if (data.max) MAX = data.max;
    if (data.colors) {
      hotColor = data.colors.hot;
      midColor = data.colors.mid;
      outerColor = data.colors.outer;
    }
    particles = Array.from({ length: MAX }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, size: 0, life: 0, maxLife: 1, alive: false,
    }));
  },

  draw({ ctx, width: cw, height: ch }) {
    // Spawn
    let spawned = 0;
    for (const p of particles) {
      if (spawned >= 2) break;
      if (!p.alive) { resetP(p, cw, ch); spawned++; }
    }

    for (const p of particles) {
      if (!p.alive) continue;
      p.life++;
      p.x += p.vx + (Math.random() - 0.5) * 0.15;
      p.y += p.vy;
      p.vy *= 0.98;
      p.vx *= 0.99;
      p.size *= 0.988;

      const progress = p.life / p.maxLife;
      if (progress >= 1 || p.size < 0.2) { p.alive = false; continue; }

      const alpha = Math.sin(progress * Math.PI);
      let rgb: string, a: number;
      if (progress < 0.3) { rgb = hotColor; a = alpha * 0.9; }
      else if (progress < 0.6) { rgb = midColor; a = alpha * 0.7; }
      else { rgb = outerColor; a = alpha * 0.3; }

      ctx.fillStyle = `rgba(${rgb},${a.toFixed(2)})`;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  },
});
