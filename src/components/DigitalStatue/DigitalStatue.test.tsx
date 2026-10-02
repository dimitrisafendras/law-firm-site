import { act, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ThemeProvider } from '@/lib/theme';
import { setMatchMedia, triggerIntersection } from '@/test/setup';
import { DigitalStatue } from './DigitalStatue';

// The light layer runs in a worker (statue.worker.ts); the component only
// hands it the canvas and listens. This stands in for that worker.
const workers: FakeWorker[] = [];
class FakeWorker {
  messages: { type: string; playing?: boolean }[] = [];
  transferred: unknown[] = [];
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  terminated = false;
  constructor() { workers.push(this); }
  postMessage(message: { type: string }, transfer: unknown[] = []) {
    this.messages.push(message);
    this.transferred.push(...transfer);
  }
  terminate() { this.terminated = true; }
  reply(data: unknown) { act(() => this.onmessage?.({ data } as MessageEvent)); }
  get running() { return this.messages.filter(m => m.type === 'run').at(-1)?.playing ?? false; }
}

beforeEach(() => {
  workers.length = 0;
  setMatchMedia(query => query.includes('min-width'));
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({ backgroundImage: 'url("/statue.avif")', getPropertyValue: () => '' } as unknown as CSSStyleDeclaration);
  vi.stubGlobal('Image', class { decode() { return Promise.resolve(); } });
  vi.stubGlobal('Worker', FakeWorker);
  HTMLCanvasElement.prototype.transferControlToOffscreen = function () { return { offscreen: this } as unknown as OffscreenCanvas; };
});
afterEach(() => {
  vi.unstubAllGlobals();
  delete (HTMLCanvasElement.prototype as { transferControlToOffscreen?: unknown }).transferControlToOffscreen;
});

async function mount() {
  const view = render(<ThemeProvider><DigitalStatue /></ThemeProvider>);
  act(() => triggerIntersection());
  await waitFor(() => expect(workers).toHaveLength(1));
  const scene = view.container.querySelector('.digital-statue')!;
  return { ...view, scene, worker: workers[0] };
}

it('hands the canvas to the worker straight away, and reveals the photograph without waiting for it', async () => {
  const { scene, worker } = await mount();
  const init = worker.messages[0];
  expect(init.type).toBe('init');
  expect(worker.transferred).toHaveLength(1);
  await waitFor(() => expect(scene).toHaveAttribute('data-scene', 'ready'));
  expect(scene).toHaveAttribute('data-surface', 'loading');
});

it('lights the figure, glare and mesh together, once the worker is warm and the entrance is over', async () => {
  let finish!: () => void;
  const entrance = {
    timeline: document.timeline, playState: 'running',
    effect: { getTiming: () => ({ iterations: 1 }) },
    finished: new Promise<void>(resolve => { finish = resolve; }),
  };
  document.getAnimations = () => [entrance as unknown as Animation];
  try {
    const { scene, worker } = await mount();
    worker.reply({ type: 'warm' });
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 20)); });
    expect(scene).toHaveAttribute('data-surface', 'loading');
    expect(scene).not.toHaveAttribute('data-charge');
    expect(worker.running).toBe(false);
    await act(async () => finish());
    await waitFor(() => expect(scene).toHaveAttribute('data-surface', 'ready'));
    expect(scene).toHaveAttribute('data-charge', 'on');
    expect(worker.running).toBe(true);
  } finally {
    delete (document as { getAnimations?: unknown }).getAnimations;
  }
});

it('shows only the photograph when the worker fails', async () => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  const { scene, worker } = await mount();
  worker.reply({ type: 'error', message: 'no webgl2' });
  expect(scene).toHaveAttribute('data-scene', 'ready');
  expect(scene).toHaveAttribute('data-surface', 'failed');
});

it('shows only the photograph where a canvas cannot be drawn off the main thread', async () => {
  delete (HTMLCanvasElement.prototype as { transferControlToOffscreen?: unknown }).transferControlToOffscreen;
  const view = render(<ThemeProvider><DigitalStatue /></ThemeProvider>);
  act(() => triggerIntersection());
  const scene = view.container.querySelector('.digital-statue')!;
  await waitFor(() => expect(scene).toHaveAttribute('data-surface', 'failed'));
  expect(workers).toHaveLength(0);
});

it('hides and pauses the light during navigation, and terminates the worker on unmount', async () => {
  const { scene, worker, unmount } = await mount();
  worker.reply({ type: 'warm' });
  await waitFor(() => expect(scene).toHaveAttribute('data-surface', 'ready'));
  act(() => window.dispatchEvent(new Event('pagehide')));
  expect(scene).toHaveAttribute('data-surface', 'loading');
  expect(worker.running).toBe(false);
  act(() => window.dispatchEvent(new Event('pageshow')));
  expect(scene).toHaveAttribute('data-surface', 'ready');
  expect(worker.running).toBe(true);
  unmount();
  expect(worker.terminated).toBe(true);
});
