import { useRef, useState, useEffect, useCallback } from 'react';

interface UseCarouselOptions {
  /** Total number of real items */
  itemCount: number;
  /** How many items visible at once (desktop) */
  visibleCount: number;
  /** Auto-scroll interval in ms */
  interval?: number;
}

/**
 * Infinite carousel hook.
 *
 * Clones the full set of items before and after the real ones so the
 * track can loop without a visible jump.  When a CSS transition ends
 * on a clone boundary we silently teleport to the matching real slide.
 */
export function useCarousel({
  itemCount,
  visibleCount,
  interval = 4000,
}: UseCarouselOptions) {
  const totalSlides = itemCount * 3; // [clone-set] [real-set] [clone-set]
  const startIndex = itemCount; // first real slide

  const [current, setCurrent] = useState(startIndex);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  /* Centre offset: the centred card is the middle of the visible window */
  const centerOffset = Math.floor(visibleCount / 2);

  /** Fold an arbitrary index back onto the real set. */
  const normalize = useCallback(
    (index: number) => startIndex + ((((index - startIndex) % itemCount) + itemCount) % itemCount),
    [itemCount, startIndex],
  );

  const goTo = useCallback(
    (index: number, animate = true) => {
      /*
       * The seamless wrap below is driven by `transitionend`, which is not
       * guaranteed to fire: the section carries `content-visibility: auto`, so
       * while it is off-screen the browser skips rendering and runs no
       * transition at all, and a backgrounded tab does the same. Autoplay keeps
       * counting regardless, so without this guard the index walks past the
       * cloned range and the track translates into empty space — the carousel
       * goes blank and never recovers.
       *
       * Anything that far out of range is resynced without animation; there is
       * nothing on screen to animate from.
       */
      if (index >= startIndex + itemCount * 2 || index < startIndex - itemCount) {
        setIsTransitioning(false);
        setCurrent(normalize(index));
        return;
      }
      setIsTransitioning(animate);
      setCurrent(index);
    },
    [itemCount, normalize, startIndex],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const goToReal = useCallback((realIndex: number) => goTo(startIndex + realIndex), [startIndex, goTo]);

  /* After a CSS transition ends, check if we need to teleport */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onEnd = (e: TransitionEvent) => {
      /* Only react to the track's own transform transition, not children */
      if (e.target !== track || e.propertyName !== 'transform') return;

      if (current >= startIndex + itemCount) {
        /* Went past the last real slide — jump to corresponding real */
        setIsTransitioning(false);
        setCurrent(startIndex + (current - startIndex - itemCount));
      } else if (current < startIndex) {
        setIsTransitioning(false);
        setCurrent(startIndex + (current - startIndex + itemCount));
      }
    };

    track.addEventListener('transitionend', onEnd);
    return () => track.removeEventListener('transitionend', onEnd);
  }, [current, itemCount, startIndex]);

  /* Auto-scroll */
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(next, interval);
    return () => clearInterval(timerRef.current);
  }, [isPaused, next, interval]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  /* Build the translate value */
  const slideWidthPercent = 100 / visibleCount;
  const translateX = -(current - centerOffset) * slideWidthPercent;

  const trackStyle: React.CSSProperties = {
    transform: `translateX(${translateX}%)`,
    transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
  };

  return {
    trackRef,
    trackStyle,
    totalSlides,
    itemCount,
    currentIndex: current,
    realIndex: ((current - startIndex) % itemCount + itemCount) % itemCount,
    next,
    prev,
    goToReal,
    pause,
    resume,
  };
}
