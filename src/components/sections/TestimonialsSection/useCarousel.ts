import { useCallback, useEffect, useState } from 'react';

interface UseQuoteRotatorOptions {
  /** Number of quotes to cycle through. */
  count: number;
  /** Milliseconds each quote is held before advancing. */
  dwell?: number;
}

export interface QuoteRotator {
  index: number;
  /** Restarts from 0 when it runs off either end. */
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  pause: () => void;
  resume: () => void;
  /** True while the timer is stopped — the progress rail reads this to hold. */
  paused: boolean;
}

/**
 * Cycles one quote at a time.
 *
 * This replaces a sliding carousel that tripled its DOM to fake an infinite
 * track, tracked a separate real and virtual index, and disabled transitions
 * on clone jumps. That machinery existed to make a three-across row loop
 * seamlessly — and the three-across row was the thing worth removing, so the
 * machinery went with it.
 *
 * One index over one array. Everything else is a cross-fade in CSS.
 */
export function useCarousel({ count, dwell = 8000 }: UseQuoteRotatorOptions): QuoteRotator {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Depends on `count` alone, so it is stable between renders unless the quote
  // list actually changes — the interval effect below can take it as a
  // dependency without re-subscribing (and so restarting the dwell) on a tick.
  const wrap = useCallback(
    (n: number) => (count <= 0 ? 0 : ((n % count) + count) % count),
    [count],
  );

  const next = useCallback(() => setIndex((i) => wrap(i + 1)), [wrap]);
  const prev = useCallback(() => setIndex((i) => wrap(i - 1)), [wrap]);
  const goTo = useCallback((n: number) => setIndex(wrap(n)), [wrap]);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = window.setInterval(() => setIndex((i) => wrap(i + 1)), dwell);
    return () => window.clearInterval(id);
  }, [paused, dwell, count, wrap]);

  /*
   * The copy is admin-editable, so the quote list can get shorter while the
   * rotator is part-way through it. Clamped on read rather than corrected in an
   * effect: an effect would render one frame pointing past the end of the
   * array first, and then render again to fix it.
   */
  const safeIndex = count > 0 ? wrap(index) : 0;

  return { index: safeIndex, next, prev, goTo, pause, resume, paused };
}
