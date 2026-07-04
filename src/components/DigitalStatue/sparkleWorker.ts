/// <reference lib="webworker" />
import { registerEffectWorker } from './effectWorkerHarness';

interface Sparkle {
  x: number; y: number; size: number;
  opacity: number; fadeSpeed: number;
  delay: number; age: number;
}

let sparkles: Sparkle[] = [];
let count = 20;
let speed = 1;
let drawScale = 6;
let starSprite: ImageBitmap | null = null;

function makeSparkle(): Sparkle {
  return {
    x: Math.random(), y: Math.random(),
    size: 0.5 + Math.random() * 1.2,
    opacity: 0,
    fadeSpeed: (0.015 + Math.random() * 0.03) * speed,
    delay: Math.random() * 80,
    age: 0,
  };
}

function resetSparkle(s: Sparkle) {
  s.x = Math.random(); s.y = Math.random();
  s.size = 0.5 + Math.random() * 1.2;
  s.opacity = 0;
  s.fadeSpeed = (0.015 + Math.random() * 0.03) * speed;
  s.delay = Math.random() * 80;
  s.age = 0;
}

interface SparkleInit {
  sprite?: ImageBitmap;
  count?: number;
  speed?: number;
  drawScale?: number;
}

registerEffectWorker<SparkleInit>({
  init(data) {
    if (data.sprite) starSprite = data.sprite;
    count = data.count || 20;
    speed = data.speed || 1;
    drawScale = data.drawScale || 6;
    sparkles = Array.from({ length: count }, makeSparkle);
  },

  draw({ ctx, width: cw, height: ch }) {
    for (const s of sparkles) {
      s.age++;
      if (s.age < s.delay) continue;

      s.opacity += s.fadeSpeed;
      if (s.opacity > 1) { s.opacity = 1; s.fadeSpeed = -Math.abs(s.fadeSpeed); }
      if (s.opacity <= 0) { resetSparkle(s); continue; }

      const px = s.x * cw;
      const py = s.y * ch;

      if (starSprite) {
        const drawSize = s.size * drawScale;
        ctx.globalAlpha = s.opacity;
        ctx.drawImage(starSprite, px - drawSize / 2, py - drawSize / 2, drawSize, drawSize);
      } else {
        // Fallback: simple dot
        ctx.globalAlpha = s.opacity;
        ctx.fillStyle = '#DCF5FF';
        ctx.beginPath();
        ctx.arc(px, py, s.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  },
});
