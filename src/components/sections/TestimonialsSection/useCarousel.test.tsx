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

  /*
   * One `act` per dwell, not one 3000ms jump.
   *
   * The timer is a `setTimeout` re-armed by an effect after each advance, so
   * the next one is only scheduled once React has flushed. `advanceTimersByTime`
   * drains the timer queue synchronously without that flush, so a single
   * 3000ms block sees exactly one advance no matter how many dwells it spans —
   * an artefact of the fake clock, not of the hook. Stepping dwell by dwell
   * measures what a browser actually does.
   */
  it('wraps forward past the last quote', () => {
    const { result } = renderHook(() => useCarousel({ count: 3, dwell: 1000 }));

    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.index).toBe(0);
    expect(result.current.cycle).toBe(3);
  });

  /*
   * The bug this hook was rewritten for. The dwell used to be a bare
   * `setInterval` that manual navigation never touched, so choosing a quote
   * late in a window meant watching it for whatever was left — click at t=900
   * of a 1000ms dwell and it was gone 100ms later.
   */
  it('gives a quote chosen by hand a full dwell, not the remainder of the last one', () => {
    const { result } = renderHook(() => useCarousel({ count: 3, dwell: 1000 }));

    act(() => vi.advanceTimersByTime(900));
    act(() => result.current.goTo(2));
    expect(result.current.index).toBe(2);

    // The 100ms that were left on the previous quote must not advance this one.
    act(() => vi.advanceTimersByTime(900));
    expect(result.current.index).toBe(2);

    act(() => vi.advanceTimersByTime(100));
    expect(result.current.index).toBe(0);
  });

  /*
   * The other half of the same bug, in the other direction. `paused` restarted
   * the interval from scratch on resume while the rail's CSS fill merely
   * un-paused mid-flight, so the bar could sit at 100% for seconds before the
   * quote actually changed. Pausing now freezes the remainder, which is what
   * `animation-play-state: paused` does.
   */
  it('resumes with the time that was left, not a fresh dwell', () => {
    const { result } = renderHook(() => useCarousel({ count: 3, dwell: 1000 }));

    act(() => vi.advanceTimersByTime(700));
    act(() => result.current.pause());
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.index).toBe(0);

    act(() => result.current.resume());

    // 300ms were owed, so 250 is not enough and the next 50 are.
    act(() => vi.advanceTimersByTime(250));
    expect(result.current.index).toBe(0);

    act(() => vi.advanceTimersByTime(50));
    expect(result.current.index).toBe(1);
  });

  /*
   * Clicking the segment already showing is the one advance that changes
   * nothing else about the DOM — same index, same active class — so `cycle` is
   * what tells the rail's fill to restart. Without it the fill would carry on
   * from wherever it had reached while the timer began again from zero.
   */
  it('bumps cycle even when the chosen quote is the one already showing', () => {
    const { result } = renderHook(() => useCarousel({ count: 3, dwell: 1000 }));

    const before = result.current.cycle;
    act(() => result.current.goTo(0));
    expect(result.current.index).toBe(0);
    expect(result.current.cycle).toBe(before + 1);
  });

  it('wraps backward past the first quote', () => {
    const { result } = renderHook(() => useCarousel({ count: 3 }));

    act(() => result.current.prev());
    expect(result.current.index).toBe(2);
  });

  it('holds while paused and continues on resume', () => {
    const { result } = renderHook(() => useCarousel({ count: 3, dwell: 1000 }));

    // Paused before any of the dwell is spent, so the whole 1000ms is still
    // owed when it resumes.
    act(() => result.current.pause());
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.index).toBe(0);
    expect(result.current.paused).toBe(true);

    act(() => result.current.resume());
    expect(result.current.paused).toBe(false);
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
