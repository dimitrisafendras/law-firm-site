/// <reference lib="webworker" />

/**
 * Shared lifecycle for the DigitalStatue canvas effect workers (rain, sparkle,
 * flame). Every effect ran an identical harness around its draw logic:
 *   - OffscreenCanvas + 2D context setup on `init`
 *   - DPR buffer scaling, re-applied after every `resize` (resetting
 *     canvas.width clears the transform, so ctx.scale must run again)
 *   - a single-rAF scheduler guard so `init` and a `visibility: true` message
 *     can't start two concurrent rAF chains
 *   - visibility pause/resume
 *
 * This module owns all of that. Each worker supplies only what differs: its
 * config/state setup (`init`), an optional size-dependent recompute (`resize`),
 * and the per-frame render (`draw`). Coordinates are CSS pixels — the harness
 * applies ctx.scale(dpr, dpr), so effects never deal with device pixels.
 */

/** Per-frame drawing surface handed to an effect. */
export interface EffectEnv {
  readonly ctx: OffscreenCanvasRenderingContext2D;
  /** Canvas width in CSS pixels. */
  readonly width: number;
  /** Canvas height in CSS pixels. */
  readonly height: number;
}

export interface EffectDefinition<TInit> {
  /** Build effect state from the init message payload. Runs once, after the
   *  canvas/context exist and have been DPR-scaled. Omit `env` if unused. */
  init(data: TInit, env: EffectEnv): void;
  /** Recompute size-dependent state after a resize (canvas already re-scaled).
   *  Omit entirely for effects that read width/height live each frame. */
  resize?(env: EffectEnv): void;
  /** Render one frame. The harness clears the canvas beforehand and schedules
   *  the next frame afterwards — just draw. */
  draw(env: EffectEnv): void;
}

interface InitMessage {
  type: 'init';
  canvas: OffscreenCanvas;
  width: number;
  height: number;
  dpr?: number;
}
interface ResizeMessage {
  type: 'resize';
  width: number;
  height: number;
  dpr?: number;
}
interface VisibilityMessage {
  type: 'visibility';
  visible: boolean;
}
type WorkerMessage = InitMessage | ResizeMessage | VisibilityMessage;

export function registerEffectWorker<TInit>(def: EffectDefinition<TInit>): void {
  let ctx: OffscreenCanvasRenderingContext2D | null = null;
  let canvas: OffscreenCanvas;
  let cw = 0, ch = 0;
  let dpr = 1;
  let visible = true;

  const env: EffectEnv = {
    // `frame` only calls draw once ctx is non-null, and effect init/resize hooks
    // that touch ctx run after it's assigned, so this assertion is safe.
    get ctx() { return ctx as OffscreenCanvasRenderingContext2D; },
    get width() { return cw; },
    get height() { return ch; },
  };

  // Single-scheduler guard: prevents concurrent rAF chains when both `init`
  // and a `visibility: true` message try to start the loop.
  let rafId: number | null = null;
  function schedule() {
    if (rafId === null) rafId = requestAnimationFrame(frame);
  }

  function frame() {
    rafId = null;
    if (!ctx || !visible || cw === 0) return;
    ctx.clearRect(0, 0, cw, ch);
    def.draw(env);
    schedule();
  }

  self.onmessage = (e: MessageEvent<WorkerMessage>) => {
    const msg = e.data;

    if (msg.type === 'init') {
      canvas = msg.canvas;
      ctx = canvas.getContext('2d');
      // cw/ch are CSS pixels; the canvas buffer is scaled by dpr so effects
      // work in CSS-pixel coordinates after ctx.scale.
      dpr = msg.dpr || 1;
      cw = msg.width;
      ch = msg.height;
      if (ctx) ctx.scale(dpr, dpr);
      // The full init payload carries effect-specific config beyond InitMessage.
      def.init(msg as unknown as TInit, env);
      schedule();
    } else if (msg.type === 'resize') {
      cw = msg.width;
      ch = msg.height;
      if (msg.dpr) dpr = msg.dpr;
      // Resetting canvas.width clears the context transform, so re-apply scale.
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      if (ctx) ctx.scale(dpr, dpr);
      def.resize?.(env);
      schedule();
    } else if (msg.type === 'visibility') {
      visible = msg.visible;
      if (visible) schedule();
    }
  };
}
