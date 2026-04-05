type DrawFn = () => void;

const callbacks = new Set<DrawFn>();
let animId: number | null = null;

// Respect prefers-reduced-motion
const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function loop() {
  animId = requestAnimationFrame(loop);
  for (const fn of callbacks) fn();
}

export function registerDraw(fn: DrawFn): () => void {
  if (!motionOk) return () => {}; // no-op if reduced motion
  callbacks.add(fn);
  if (callbacks.size === 1 && animId === null) {
    animId = requestAnimationFrame(loop);
  }
  return () => {
    callbacks.delete(fn);
    if (callbacks.size === 0 && animId !== null) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  };
}

// Adaptive quality: fewer particles on mobile / low-end
export const IS_LOW_END = (navigator.hardwareConcurrency ?? 4) < 4 || window.innerWidth < 768;
export const QUALITY = IS_LOW_END ? 0.5 : 1;
