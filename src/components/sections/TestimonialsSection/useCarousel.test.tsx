import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCarousel } from './useCarousel';

/**
 * The hook that replaced the sliding carousel.
 *
 * Most of what the old suite covered — clone offsets, transition suppression
 * on the wrap jump, the real-vs-virtual index pair — described machinery that
 * no longer exists. What survives is the behaviour a reader can observe: the
 * quote advances on its own, wraps at both ends, stops when asked, and never
 * points past the end of the list.
 */
describe('useCarousel', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts on the first quote', () => {
    const { result } = renderHook(() => useCarousel({ count: 3 }));
    expect(result.current.index).toBe(0);
    expect(result.current.paused).toBe(false);
  });

  it('advances once per dwell', () => {
    const { result } = renderHook(() => useCarousel({ count: 3, dwell: 1000 }));

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.index).toBe(1);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.index).toBe(2);
  });

  it('wraps forward past the last quote', () => {
    const { result } = renderHook(() => useCarousel({ count: 3, dwell: 1000 }));

    act(() => vi.advanceTimersByTime(3000));
    expect(result.current.index).toBe(0);
  });

  it('wraps backward past the first quote', () => {
    const { result } = renderHook(() => useCarousel({ count: 3 }));

    act(() => result.current.prev());
    expect(result.current.index).toBe(2);
  });

  it('holds while paused and continues on resume', () => {
    const { result } = renderHook(() => useCarousel({ count: 3, dwell: 1000 }));

    act(() => result.current.pause());
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.index).toBe(0);
    expect(result.current.paused).toBe(true);

    act(() => result.current.resume());
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.index).toBe(1);
  });

  it('clamps an out-of-range goTo instead of pointing past the end', () => {
    const { result } = renderHook(() => useCarousel({ count: 3 }));

    act(() => result.current.goTo(7));
    expect(result.current.index).toBe(1);

    act(() => result.current.goTo(-1));
    expect(result.current.index).toBe(2);
  });

  it('does not run a timer for a single quote', () => {
    const { result } = renderHook(() => useCarousel({ count: 1, dwell: 1000 }));

    act(() => vi.advanceTimersByTime(10_000));
    expect(result.current.index).toBe(0);
  });

  it('never points past the end when the list shrinks under it', () => {
    // The copy is admin-editable, so the quote list can get shorter while the
    // rotator is part-way through it. What matters is that the index it hands
    // back is always a real position in the current list.
    const { result, rerender } = renderHook(({ count }) => useCarousel({ count }), {
      initialProps: { count: 6 },
    });

    act(() => result.current.goTo(5));
    expect(result.current.index).toBe(5);

    rerender({ count: 2 });
    expect(result.current.index).toBeLessThan(2);
    expect(result.current.index).toBeGreaterThanOrEqual(0);
  });
});
