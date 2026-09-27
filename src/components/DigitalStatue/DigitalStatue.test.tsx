import { act, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { ImageAsset, RiveParameters } from '@rive-app/webgl2';
import { ThemeProvider } from '@/lib/theme';
import { setMatchMedia, triggerIntersection } from '@/test/setup';
import { DigitalStatue } from './DigitalStatue';

const mock = vi.hoisted(() => ({
  params: null as RiveParameters | null,
  decode: vi.fn(),
  play: vi.fn(),
  cleanup: vi.fn(),
}));
vi.mock('@rive-app/webgl2', () => ({
  Rive: class {
    constructor(params: RiveParameters) { mock.params = params; }
    play = mock.play;
    pause = vi.fn();
    cleanup = mock.cleanup;
    resizeDrawingSurfaceToCanvas = vi.fn();
  },
  Layout: class {}, Fit: { Fill: 0 }, Alignment: { Center: 0 },
  DrawOptimizationOptions: { AlwaysDraw: 0 },
  RuntimeLoader: { setWasmUrl: vi.fn(), setWasmFallbackUrl: vi.fn() },
  decodeImage: mock.decode,
}));

beforeEach(() => {
  mock.params = null;
  mock.play.mockClear();
  setMatchMedia(query => query.includes('min-width'));
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, arrayBuffer: async () => new ArrayBuffer(1) }));
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({ backgroundImage: 'url("/statue.avif")' } as CSSStyleDeclaration);
  vi.stubGlobal('Image', class { decode() { return Promise.resolve(); } });
});
afterEach(() => { vi.unstubAllGlobals(); });

async function mount() {
  const view = render(<ThemeProvider><DigitalStatue /></ThemeProvider>);
  act(() => triggerIntersection());
  await waitFor(() => expect(mock.params).not.toBeNull());
  return { ...view, scene: view.container.querySelector('.digital-statue')! };
}

it('waits for embedded textures and the first rendered frame before revealing either layer', async () => {
  let resolveTexture!: (image: { unref: () => void }) => void;
  mock.decode.mockReturnValue(new Promise(resolve => { resolveTexture = resolve; }));
  const { scene } = await mount();
  const asset = { isImage: true, setRenderImage: vi.fn() };
  mock.params!.assetLoader!(asset as unknown as ImageAsset, new Uint8Array(1));
  mock.params!.onLoad!({ type: 'load' } as never);
  await act(async () => {});
  expect(scene).toHaveAttribute('data-scene', 'loading');
  expect(mock.play).not.toHaveBeenCalled();
  const image = { unref: vi.fn() };
  await act(async () => resolveTexture(image));
  expect(asset.setRenderImage).toHaveBeenCalledWith(image);
  expect(image.unref).toHaveBeenCalled();
  expect(scene).toHaveAttribute('data-scene', 'loading');
  mock.params!.onAdvance!({ type: 'advance' } as never);
  await waitFor(() => expect(scene).toHaveAttribute('data-scene', 'ready'));
  expect(scene).toHaveAttribute('data-surface', 'ready');
});

it('shows only the photograph when Rive fails', async () => {
  const { scene } = await mount();
  act(() => mock.params!.onLoadError!({ type: 'loaderror' } as never));
  expect(scene).toHaveAttribute('data-scene', 'ready');
  expect(scene).toHaveAttribute('data-surface', 'failed');
});

it('does not attach a late texture to a destroyed instance', async () => {
  let resolveTexture!: (image: { unref: () => void }) => void;
  mock.decode.mockReturnValue(new Promise(resolve => { resolveTexture = resolve; }));
  const { unmount } = await mount();
  const asset = { isImage: true, setRenderImage: vi.fn() };
  mock.params!.assetLoader!(asset as unknown as ImageAsset, new Uint8Array(1));
  unmount();
  const image = { unref: vi.fn() };
  await act(async () => resolveTexture(image));
  expect(asset.setRenderImage).not.toHaveBeenCalled();
  expect(image.unref).toHaveBeenCalled();
});
