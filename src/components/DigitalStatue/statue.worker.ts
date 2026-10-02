/// <reference lib="webworker" />
/**
 * The statue's light layer, rendered off the main thread.
 *
 * Rive's start-up on the page — parsing the .riv, decoding its 535 images,
 * uploading them and compiling shaders — was ~0.45s of main-thread work, and
 * nothing in the hero could move while it ran without stuttering. So it had
 * to wait until the entrance had played out, and the statue lit up a beat
 * after the last word rather than with it. Here it all happens in a worker
 * that draws straight into the page's canvas (transferControlToOffscreen),
 * so it can warm up while the entrance is still playing and be ready the
 * moment it ends.
 *
 * The protocol (see DigitalStatue.tsx):
 *
 *   in   init    the canvas, the .riv and WASM URLs, the drawing size
 *        run     play or pause
 *        resize  a new drawing size
 *   out  warm    loaded, every image decoded, and rendering smoothly; the
 *                worker then holds still until it is told to run
 *        error   it cannot run; the page shows the photograph alone
 */
import { RuntimeLoader } from '@rive-app/webgl2';
import type { Artboard, File, RiveCanvas, StateMachineInstance, WrappedRenderer } from '@rive-app/webgl2/rive_advanced.mjs';

type Message =
  | { type: 'init'; canvas: OffscreenCanvas; riv: string; wasm: string; width: number; height: number }
  | { type: 'run'; playing: boolean }
  | { type: 'resize'; width: number; height: number };

const post = (message: { type: 'warm' } | { type: 'error'; message: string }) => self.postMessage(message);
const fail = (error: unknown) => post({ type: 'error', message: error instanceof Error ? error.message : String(error) });

/*
 * Two things the runtime reaches for that a worker does not have.
 *
 * `document.createElement('canvas')`: makeRenderer probes WebGL support with a
 * throwaway canvas, and with the offscreen renderer it keeps that canvas as the
 * shared drawing surface. An OffscreenCanvas does both jobs.
 *
 * `new Image()`: the WebGL2 build decodes embedded images by pointing an
 * <img> at a blob URL and uploading the element once it loads. This stands in
 * with createImageBitmap — which decodes off-thread as well — and texImage2D is
 * taught to upload the bitmap it holds. The runtime uploads with
 * UNPACK_PREMULTIPLY_ALPHA, which WebGL ignores for an ImageBitmap, so the
 * bitmap is premultiplied at decode instead.
 */
let pending = 0;
let decoded = 0;
let decodeFailed = false;
class WorkerImage {
  width = 0;
  height = 0;
  bitmap: ImageBitmap | null = null;
  onload: (() => void) | null = null;
  set src(url: string) {
    pending++;
    void fetch(url).then(response => response.blob())
      .then(blob => createImageBitmap(blob, { premultiplyAlpha: 'premultiply' }))
      .then(bitmap => {
        this.bitmap = bitmap;
        this.width = bitmap.width;
        this.height = bitmap.height;
        URL.revokeObjectURL(url);
        decoded++;
        this.onload?.();
      })
      .catch(error => { decodeFailed = true; fail(error); });
  }
}
const scope = self as unknown as {
  document?: unknown; Image?: unknown;
  requestAnimationFrame?: (callback: FrameRequestCallback) => number;
  cancelAnimationFrame?: (handle: number) => void;
};
scope.document ??= { createElement: () => new OffscreenCanvas(1, 1) };
scope.Image ??= WorkerImage;
// Chrome and Firefox give a dedicated worker requestAnimationFrame; Safari
// does not, and the runtime's frame loop is built on it.
scope.requestAnimationFrame ??= callback => setTimeout(() => callback(performance.now()), 1000 / 60);
scope.cancelAnimationFrame ??= handle => clearTimeout(handle);
const upload = WebGL2RenderingContext.prototype.texImage2D as (...args: unknown[]) => void;
WebGL2RenderingContext.prototype.texImage2D = function (this: WebGL2RenderingContext, ...args: unknown[]) {
  const last = args.length - 1;
  if (args[last] instanceof WorkerImage) args[last] = (args[last] as WorkerImage).bitmap;
  return upload.apply(this, args);
} as typeof WebGL2RenderingContext.prototype.texImage2D;

let rive: RiveCanvas;
let canvas: OffscreenCanvas;
let file: File;
let artboard: Artboard;
let machine: StateMachineInstance;
let renderer: WrappedRenderer;
let playing = false;
let warm = false;
let frameId = 0;
let lastTime = 0;
let smooth = 0;
let warmStarted = 0;

const draw = () => {
  renderer.clear();
  renderer.save();
  renderer.align(rive.Fit.fill, rive.Alignment.center,
    { minX: 0, minY: 0, maxX: canvas.width, maxY: canvas.height }, artboard.bounds);
  artboard.draw(renderer);
  renderer.restore();
  renderer.flush();
};

const frame = (time: number) => {
  frameId = 0;
  // Large gaps (a paused tab, a held frame) are not animation time.
  const elapsed = lastTime ? Math.min(time - lastTime, 100) : 0;
  if (!warm) {
    /*
     * Warm-up: draw until every image has decoded and three consecutive frames
     * have come in under 25ms — the first frames upload textures and compile
     * shaders, 100ms+ each — capped so it can never hang. Then report, and
     * hold still so the warm-up does not keep the GPU busy under the entrance.
     */
    smooth = lastTime && elapsed < 25 ? smooth + 1 : 0;
    const done = decoded === pending && pending > 0;
    if (!done || (smooth < 3 && time - warmStarted < 1500)) {
      lastTime = time;
      machine.advanceAndApply(elapsed / 1000);
      draw();
      frameId = rive.requestAnimationFrame(frame);
      return;
    }
    warm = true;
    post({ type: 'warm' });
  }
  if (!playing) { lastTime = 0; return; }
  lastTime = time;
  machine.advanceAndApply(elapsed / 1000);
  draw();
  frameId = rive.requestAnimationFrame(frame);
};

const schedule = () => {
  if (!frameId && rive && machine) frameId = rive.requestAnimationFrame(frame);
};

const init = async ({ riv, wasm, width, height, canvas: target }: Extract<Message, { type: 'init' }>) => {
  canvas = target;
  canvas.width = width;
  canvas.height = height;
  RuntimeLoader.setWasmUrl(wasm);
  RuntimeLoader.setWasmFallbackUrl(null);
  const [runtime, buffer] = await Promise.all([
    RuntimeLoader.awaitInstance(),
    fetch(riv).then(response => {
      if (!response.ok) throw new Error(`Statue animation: HTTP ${response.status}`);
      return response.arrayBuffer();
    }),
  ]);
  rive = runtime;
  file = await rive.load(new Uint8Array(buffer), undefined, false);
  artboard = file.artboardByName('Mesh');
  machine = new rive.StateMachineInstance(artboard.stateMachineByName('Ambient'), artboard);
  // Copy completed GPU frames into a 2D canvas: a directly composited WebGL
  // surface can flash opaque during rapid navigations.
  renderer = rive.makeRenderer(canvas, true);
  if (decodeFailed) return;
  warmStarted = performance.now();
  schedule();
};

self.onmessage = ({ data }: MessageEvent<Message>) => {
  switch (data.type) {
    case 'init':
      init(data).catch(fail);
      break;
    case 'run':
      playing = data.playing;
      if (playing) schedule();
      break;
    case 'resize':
      if (!canvas) break;
      canvas.width = data.width;
      canvas.height = data.height;
      // A held frame has to be redrawn at the new size. Outside the runtime's
      // own requestAnimationFrame the offscreen copy has to be asked for.
      if (warm && !playing && machine) { draw(); rive.resolveAnimationFrame(); }
      break;
  }
};

export type StatueWorkerMessage = Message;
