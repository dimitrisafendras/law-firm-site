/// <reference lib="webworker" />

let ctx: OffscreenCanvasRenderingContext2D | null = null;
let canvas: OffscreenCanvas;
let cw = 0, ch = 0;
let visible = true;
let starSprite: ImageBitmap | null = null;

interface Sparkle {
  x: number; y: number; size: number;
  opacity: number; fadeSpeed: number;
  delay: number; age: number;
}

let sparkles: Sparkle[] = [];
let count = 20;
let speed = 1;

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

function draw() {
  if (!ctx || !visible || cw === 0) return;

  ctx.clearRect(0, 0, cw, ch);

  for (const s of sparkles) {
    s.age++;
    if (s.age < s.delay) continue;

    s.opacity += s.fadeSpeed;
    if (s.opacity > 1) { s.opacity = 1; s.fadeSpeed = -Math.abs(s.fadeSpeed); }
    if (s.opacity <= 0) { resetSparkle(s); continue; }

    const px = s.x * cw;
    const py = s.y * ch;

    if (starSprite) {
      const drawSize = s.size * 6;
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

  requestAnimationFrame(draw);
}

self.onmessage = (e: MessageEvent) => {
  const { type } = e.data;

  if (type === 'init') {
    canvas = e.data.canvas as OffscreenCanvas;
    ctx = canvas.getContext('2d');
    if (e.data.sprite) starSprite = e.data.sprite as ImageBitmap;
    cw = e.data.width;
    ch = e.data.height;
    count = e.data.count || 20;
    speed = e.data.speed || 1;
    sparkles = Array.from({ length: count }, makeSparkle);
    requestAnimationFrame(draw);
  }

  if (type === 'resize') {
    cw = e.data.width;
    ch = e.data.height;
    canvas.width = cw;
    canvas.height = ch;
  }

  if (type === 'visibility') {
    visible = e.data.visible;
    if (visible) requestAnimationFrame(draw);
  }
};
