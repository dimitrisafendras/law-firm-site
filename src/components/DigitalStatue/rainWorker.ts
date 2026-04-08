/// <reference lib="webworker" />

const TRAIL = 12;
const FONT_SIZE = 10;
const CHARS = '01';

// Pre-computed alphas
const ALPHAS: number[] = [];
for (let j = 0; j < TRAIL; j++) {
  const fade = 1 - j / TRAIL;
  ALPHAS[j] = j === 0 ? 0.9 * fade : 0.7 * fade;
}

let ctx: OffscreenCanvasRenderingContext2D | null = null;
let canvas: OffscreenCanvas;
let cw = 0, ch = 0;
let endCol = 0, maxRow = 0;
let drops: { y: number; speed: number; chars: string[] }[] = [];
let visible = true;
let spriteSheet: ImageBitmap | null = null;
const CELL = FONT_SIZE + 2;

function initDrops() {
  drops = Array.from({ length: Math.max(1, endCol) }, () => ({
    y: Math.random() * -30,
    speed: 0.015 + Math.random() * 0.025,
    chars: Array.from({ length: TRAIL }, () => CHARS[(Math.random() * 2) | 0]),
  }));
}

function draw() {
  if (!ctx || !visible || cw === 0) return;

  ctx.clearRect(0, 0, cw, ch);

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

  requestAnimationFrame(draw);
}

self.onmessage = (e: MessageEvent) => {
  const { type } = e.data;

  if (type === 'init') {
    canvas = e.data.canvas as OffscreenCanvas;
    ctx = canvas.getContext('2d');
    if (e.data.sprite) spriteSheet = e.data.sprite as ImageBitmap;
    cw = e.data.width;
    ch = e.data.height;
    endCol = Math.floor(cw / FONT_SIZE);
    maxRow = Math.floor(ch / FONT_SIZE);
    initDrops();
    requestAnimationFrame(draw);
  }

  if (type === 'resize') {
    cw = e.data.width;
    ch = e.data.height;
    canvas.width = cw;
    canvas.height = ch;
    endCol = Math.floor(cw / FONT_SIZE);
    maxRow = Math.floor(ch / FONT_SIZE);
    initDrops();
  }

  if (type === 'visibility') {
    visible = e.data.visible;
    if (visible) requestAnimationFrame(draw);
  }
};
