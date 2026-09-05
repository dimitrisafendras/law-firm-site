import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCarousel } from './useCarousel';

type CarouselOpts = Parameters<typeof useCarousel>[0];

/**
 * renderHook leaves trackRef.current null, so the transitionend listener never
 * binds. Attach a real (detached) element to the ref; the listener re-binds on
 * the next state change (the effect deps include `current`), which the teleport
 * tests trigger with a next()/prev() before dispatching. dispatchEvent works on
 * detached elements, so there's no need to touch document.body.
 */
function renderCarouselWithTrack(opts: CarouselOpts) {
  const view = renderHook(() => useCarousel(opts));
  const track = document.createElement('div');
  view.result.current.trackRef.current = track;
  return { result: view.result, track };
}

/** Fire a transform transitionend on the track, as the browser would. */
function fireTransformEnd(track: HTMLElement) {
  const ev = new Event('transitionend');
  Object.defineProperty(ev, 'propertyName', { value: 'transform' });
  act(() => {
    track.dispatchEvent(ev);
  });
}

describe('useCarousel', () => {
  describe('initial state', () => {
    it('starts on the first real slide with three cloned sets', () => {
      const { result } = renderHook(() =>
        useCarousel({ itemCount: 3, visibleCount: 1 }),
      );
      // [clone-set][real-set][clone-set] => 3 * itemCount
      expect(result.current.totalSlides).toBe(9);
      // startIndex === itemCount, i.e. the first real slide
      expect(result.current.currentIndex).toBe(3);
      expect(result.current.realIndex).toBe(0);
    });
  });

  describe('next / prev', () => {
    it('next advances the raw index and maps realIndex within the real set', () => {
      const { result } = renderHook(() =>
        useCarousel({ itemCount: 3, visibleCount: 1 }),
      );

      act(() => result.current.next());
      expect(result.current.currentIndex).toBe(4);
      expect(result.current.realIndex).toBe(1);

      act(() => result.current.next());
      expect(result.current.currentIndex).toBe(5);
      expect(result.current.realIndex).toBe(2);

      // Stepping onto the leading clone of the *next* set wraps realIndex to 0
      act(() => result.current.next());
      expect(result.current.currentIndex).toBe(6);
      expect(result.current.realIndex).toBe(0);
    });

    it('prev decrements and realIndex wraps correctly onto trailing clones', () => {
      const { result } = renderHook(() =>
        useCarousel({ itemCount: 3, visibleCount: 1 }),
      );

      act(() => result.current.prev());
      // current 3 -> 2 (a trailing clone); realIndex ((2-3)%3+3)%3 === 2
      expect(result.current.currentIndex).toBe(2);
      expect(result.current.realIndex).toBe(2);
    });

    it('goToReal jumps to a specific real slide', () => {
      const { result } = renderHook(() =>
        useCarousel({ itemCount: 4, visibleCount: 1 }),
      );
      act(() => result.current.goToReal(2));
      expect(result.current.currentIndex).toBe(4 + 2); // startIndex + realIndex
      expect(result.current.realIndex).toBe(2);
    });
  });

  describe('teleport on clone boundary (transitionend)', () => {
    it('teleports forward without animation after passing the last real slide', () => {
      const { result, track } = renderCarouselWithTrack({ itemCount: 3, visibleCount: 1 });

      // Advance to the first leading clone of the next set: current === 6
      act(() => result.current.next());
      act(() => result.current.next());
      act(() => result.current.next());
      expect(result.current.currentIndex).toBe(6);

      fireTransformEnd(track);

      // Jumped back to the matching real slide, transition disabled for the jump
      expect(result.current.currentIndex).toBe(3);
      expect(result.current.realIndex).toBe(0);
      expect(result.current.trackStyle.transition).toBe('none');
    });

    it('teleports backward without animation after passing the first real slide', () => {
      const { result, track } = renderCarouselWithTrack({ itemCount: 3, visibleCount: 1 });

      // Step onto a trailing clone: current === 2 (< startIndex)
      act(() => result.current.prev());
      expect(result.current.currentIndex).toBe(2);

      fireTransformEnd(track);

      // startIndex + (2 - startIndex + itemCount) === 3 + 2 === 5
      expect(result.current.currentIndex).toBe(5);
      expect(result.current.realIndex).toBe(2);
      expect(result.current.trackStyle.transition).toBe('none');
    });

    it('does not teleport for non-transform transitions', () => {
      const { result, track } = renderCarouselWithTrack({ itemCount: 3, visibleCount: 1 });
      act(() => result.current.next());
      act(() => result.current.next());
      act(() => result.current.next());
      expect(result.current.currentIndex).toBe(6);

      const ev = new Event('transitionend');
      Object.defineProperty(ev, 'propertyName', { value: 'opacity' });
      act(() => {
        track.dispatchEvent(ev);
      });

      // Unchanged — the handler ignores non-transform property transitions
      expect(result.current.currentIndex).toBe(6);
    });
  });

  describe('autoplay with pause / resume', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('advances on each interval and honours pause / resume', () => {
      const { result } = renderHook(() =>
        useCarousel({ itemCount: 3, visibleCount: 1, interval: 1000 }),
      );
      expect(result.current.currentIndex).toBe(3);

      act(() => vi.advanceTimersByTime(1000));
      expect(result.current.currentIndex).toBe(4);

      act(() => vi.advanceTimersByTime(1000));
      expect(result.current.currentIndex).toBe(5);

      // Paused: elapsed time must not advance the carousel
      act(() => result.current.pause());
      act(() => vi.advanceTimersByTime(5000));
      expect(result.current.currentIndex).toBe(5);

      // Resumed: ticking continues from where it left off
      act(() => result.current.resume());
      act(() => vi.advanceTimersByTime(1000));
      expect(result.current.currentIndex).toBe(6);
    });
  });
});
