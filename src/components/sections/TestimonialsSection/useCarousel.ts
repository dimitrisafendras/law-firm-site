import { useCallback, useEffect, useRef, useState } from 'react';

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
  /**
   * Increments on every advance, manual or automatic. The rail's fill keys on
   * it so the CSS animation restarts in lockstep with the timer — including
   * when the target is the segment already showing, where nothing else about
   * the DOM changes.
   */
  cycle: number;
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
 *
 * ## One clock, not two
 *
 * The dwell used to be a bare `setInterval` whose effect depended only on
 * `[paused, dwell, count, wrap]`. `next`, `prev` and `goTo` change none of
 * those — they only call `setIndex` — so a rail click landed in the middle of
 * an already-running window. Click at t=7.5s of an 8s dwell and the quote you
 * chose was gone 500ms later. The rail's progress fill meanwhile *did* restart,
 * because it is a CSS animation bound to the active segment and the active
 * class had moved: two clocks that agreed only during uninterrupted autoplay.
 *
 * Hover desynced them the other way. `paused` *is* a dependency, so leaving the
 * stage tore down the interval and began a fresh full dwell, while the CSS fill
 * merely flipped `animation-play-state` back to `running` and carried on from
 * where it stopped. Hover for 3s at t=1s and the fill hit 100% at t=8s while
 * the timer, restarted at t=4s, did not fire until t=12s — four seconds of a
 * completely full bar going nowhere.
 *
 * Both are gone because the timer now models what the CSS animation already
 * did, rather than approximating it:
 *
 * - It is a `setTimeout` over `remainingRef`, not a repeating interval.
 * - Pausing *freezes* what is left; resuming continues from there. That is
 *   exactly `animation-play-state: paused`, so the fill and the timer stop and
 *   start on the same millisecond.
 * - Any advance — the timer's own, a rail click, an arrow key — resets the
 *   remainder to a full dwell and bumps `cycle`, which restarts both the
 *   effect and (via its key) the fill.
 */
export function useCarousel({ count, dwell = 8000 }: UseQuoteRotatorOptions): QuoteRotator {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);

  /** Milliseconds still owed to the current quote. */
  const remainingRef = useRef(dwell);
  /** When the running timeout was armed, so a pause can subtract what it spent. */
  const startedAtRef = useRef(0);
  /**
   * Mirrors `paused` for the pause/resume handlers. They have to read and write
   * the remainder synchronously, and doing that inside a `setPaused` updater
   * would run it twice under StrictMode's double invocation — subtracting the
   * elapsed time from the remainder twice over.
   */
  const pausedRef = useRef(false);

  // Depends on `count` alone, so it is stable between renders unless the quote
  // list actually changes.
  const wrap = useCallback(
    (n: number) => (count <= 0 ? 0 : ((n % count) + count) % count),
    [count],
  );

  /** Every path that changes the quote goes through here, so every one of them
      gets a full dwell and a fill that restarts with it. */
  const advance = useCallback(
    (to: (current: number) => number) => {
      remainingRef.current = dwell;
      startedAtRef.current = Date.now();
      setIndex((i) => to(i));
      setCycle((c) => c + 1);
    },
    [dwell],
  );

  const next = useCallback(() => advance((i) => wrap(i + 1)), [advance, wrap]);
  const prev = useCallback(() => advance((i) => wrap(i - 1)), [advance, wrap]);
  const goTo = useCallback((n: number) => advance(() => wrap(n)), [advance, wrap]);

  const pause = useCallback(() => {
    if (pausedRef.current) return;
    pausedRef.current = true;
    const spent = Date.now() - startedAtRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - spent);
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (!pausedRef.current) return;
    pausedRef.current = false;
    setPaused(false);
  }, []);

  useEffect(() => {
    if (paused || count <= 1) return;
    startedAtRef.current = Date.now();
    const id = window.setTimeout(() => {
      remainingRef.current = dwell;
      startedAtRef.current = Date.now();
      setIndex((i) => wrap(i + 1));
      setCycle((c) => c + 1);
    }, remainingRef.current);
    return () => window.clearTimeout(id);
    // `cycle` is a dependency on purpose: it is what re-arms the timeout after
    // a manual jump, which is the whole point of the rewrite.
  }, [paused, dwell, count, wrap, cycle]);

  /*
   * The copy is admin-editable, so the quote list can get shorter while the
   * rotator is part-way through it. Clamped on read rather than corrected in an
   * effect: an effect would render one frame pointing past the end of the
   * array first, and then render again to fix it.
   */
  const safeIndex = count > 0 ? wrap(index) : 0;

  return { index: safeIndex, next, prev, goTo, pause, resume, paused, cycle };
}
