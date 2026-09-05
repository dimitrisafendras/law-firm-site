/// <reference lib="webworker" />
import { registerEffectWorker } from './effectWorkerHarness';

const CHARS = '01';

let TRAIL = 12;
let FONT_SIZE = 8;
let CELL = FONT_SIZE + 2;
let ALPHAS: number[] = [];

function computeAlphas() {
  ALPHAS = [];
  for (let j = 0; j < TRAIL; j++) {
    const fade = 1 - j / TRAIL;
    ALPHAS[j] = j === 0 ? 0.9 * fade : 0.7 * fade;
  }
}
computeAlphas();

let endCol = 0, maxRow = 0;
let drops: { y: number; speed: number; chars: string[] }[] = [];
let spriteSheet: ImageBitmap | null = null;

function initDrops() {
  drops = Array.from({ length: Math.max(1, endCol) }, () => ({
    y: Math.random() * (maxRow + TRAIL) - TRAIL,
    speed: 0.015 + Math.random() * 0.025,
    chars: Array.from({ length: TRAIL }, () => CHARS[(Math.random() * 2) | 0]),
  }));
}

interface RainInit {
  sprite?: ImageBitmap;
  fontSize?: number;
  trail?: number;
}

registerEffectWorker<RainInit>({
  init(data, env) {
    if (data.sprite) spriteSheet = data.sprite;
    if (data.fontSize) { FONT_SIZE = data.fontSize; CELL = FONT_SIZE + 2; }
    if (data.trail) { TRAIL = data.trail; computeAlphas(); }
    endCol = Math.floor(env.width / FONT_SIZE);
    maxRow = Math.floor(env.height / FONT_SIZE);
    initDrops();
  },

  resize(env) {
    endCol = Math.floor(env.width / FONT_SIZE);
    maxRow = Math.floor(env.height / FONT_SIZE);
    initDrops();
  },

  draw({ ctx, height: ch }) {
    if (spriteSheet) {
      // Use sprite sheet (drawImage) — much faster than fillText
      for (let i = 0; i < endCol; i++) {
        const drop = drops[i];
        const x = i * FONT_SIZE;

        for (let j = 0; j < TRAIL; j++) {
          const yPx = (drop.y - j) * FONT_SIZE;
          if (yPx < -CELL || yPx > ch) continue;

          const charIdx = drop.chars[j] === '1' ? 1 : 0;
          ctx.globalAlpha = ALPHAS[j];
          ctx.drawImage(spriteSheet, charIdx * CELL, j * CELL, CELL, CELL, x, yPx, CELL, CELL);
        }

        drop.y += drop.speed;

        if (Math.random() > 0.92) {
          drop.chars[(Math.random() * TRAIL) | 0] = CHARS[(Math.random() * 2) | 0];
        }
        if (drop.y - TRAIL > maxRow && Math.random() > 0.97) {
          drop.y = 0;
          drop.speed = 0.02 + Math.random() * 0.03;
        }
      }
      ctx.globalAlpha = 1;
    } else {
      // Fallback: fillText (slower but works without sprite)
      ctx.font = `${FONT_SIZE}px monospace`;
      for (let i = 0; i < endCol; i++) {
        const drop = drops[i];
        const x = i * FONT_SIZE;

        for (let j = 0; j < TRAIL; j++) {
          const yPx = (drop.y - j) * FONT_SIZE;
          if (yPx < -CELL || yPx > ch) continue;

          const fade = 1 - j / TRAIL;
          ctx.fillStyle = j === 0
            ? `rgba(188,232,255,${(0.9 * fade).toFixed(3)})`
            : `rgba(137,207,240,${(0.7 * fade).toFixed(3)})`;
          ctx.fillText(drop.chars[j], x, yPx);
        }

        drop.y += drop.speed;

        if (Math.random() > 0.92) {
          drop.chars[(Math.random() * TRAIL) | 0] = CHARS[(Math.random() * 2) | 0];
        }
        if (drop.y - TRAIL > maxRow && Math.random() > 0.97) {
          drop.y = 0;
          drop.speed = 0.02 + Math.random() * 0.03;
        }
      }
    }
  },
});
