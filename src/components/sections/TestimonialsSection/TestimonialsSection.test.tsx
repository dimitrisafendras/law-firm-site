import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, renderWithProviders, screen } from '@/test/utils';
import { TestimonialsSection } from './TestimonialsSection';

/**
 * The section, as opposed to the hook.
 *
 * `useCarousel.test.tsx` pins the timing contract. What is here is everything
 * the timer cannot know about: whether a change is announced, whether the
 * reader's system preference is allowed to stop it, and which of the several
 * things that can hold the timer outrank the others.
 */

/** Matches `DWELL_MS` in the component. */
const DWELL = 8000;

const PAUSE_LABEL = 'Pause the rotating quotes';
const RESUME_LABEL = 'Resume the rotating quotes';

const FIRST_AUTHOR = 'Yiannis Papadopoulos';
const SECOND_AUTHOR = 'Captain Nikos Stavridis';

/**
 * A `prefers-reduced-motion` the test can flip *after* render.
 *
 * The shared stub in `src/test/setup.ts` can only answer a query; every call to
 * it builds a fresh MediaQueryList with its own listener set, so a test holding
 * one of them cannot reach the listener the component registered on another.
 * This one keeps a single preference and a single listener set behind all the
 * lists it hands out, which is what a real browser does and what a test of a
 * *live* subscription needs.
 */
function installReducedMotionControl(initial = false) {
  let reduced = initial;
  const listeners = new Set<() => void>();

  vi.stubGlobal('matchMedia', (query: string) => ({
    media: query,
    get matches() {
      return query.includes('prefers-reduced-motion') ? reduced : false;
    },
    onchange: null,
    addListener: (listener: () => void) => listeners.add(listener),
    removeListener: (listener: () => void) => listeners.delete(listener),
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
    dispatchEvent: () => true,
  }));

  return {
    set(next: boolean) {
      reduced = next;
      for (const listener of [...listeners]) listener();
    },
  };
}

/** The stage element — the hover surface and the region wrapper. */
function stage(container: HTMLElement): HTMLElement {
  const el = container.querySelector<HTMLElement>('.testimonials-stage');
  if (!el) throw new Error('stage not rendered');
  return el;
}

function liveRegion(container: HTMLElement): HTMLElement {
  const el = container.querySelector<HTMLElement>('[aria-live="polite"]');
  if (!el) throw new Error('no polite live region');
  return el;
}

/*
 * The one quote on screen.
 *
 * The stage renders seven figures: six inside an `aria-hidden` sizer that only
 * exists to hold the column at the tallest quote's height, and the one the
 * reader is actually looking at. That makes `expect(shownQuote(container)).toHaveTextContent(...)`
 * useless here — the container holds every quote's text at all times, so such an
 * assertion passes whatever the carousel is doing, including nothing. Every
 * assertion about *which* quote is showing goes through this.
 */
function shownQuote(container: HTMLElement): HTMLElement {
  const figure = container.querySelector<HTMLElement>('.testimonials-stage__quote--live');
  if (!figure) throw new Error('No visible quote figure rendered');
  return figure;
}

describe('TestimonialsSection', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    installReducedMotionControl(false);
  });
  afterEach(() => vi.useRealTimers());

  describe('announcements', () => {
    /*
     * The defect: `aria-live` sat on the figure, and the figure carries
     * `key={index}`. React therefore destroyed and rebuilt the region on every
     * change, and a region that is new is not a region that mutated — so
     * assistive tech had nothing to announce, ever. The fix has to keep the
     * region identical across a change while still replacing the figure.
     */
    it('changes the contents of a live region that itself survives the change', () => {
      const { container } = renderWithProviders(<TestimonialsSection />);

      const region = liveRegion(container);
      const figureBefore = shownQuote(container);
      expect(shownQuote(container)).toHaveTextContent(FIRST_AUTHOR);

      act(() => {
        vi.advanceTimersByTime(DWELL);
      });

      expect(liveRegion(container)).toBe(region);
      expect(shownQuote(container)).toHaveTextContent(SECOND_AUTHOR);
      // …and the figure inside it is a different element, which is what makes
      // the entering quote run its cross-fade from the start.
      expect(shownQuote(container)).not.toBe(figureBefore);
    });

    it('reads the quote with its attribution rather than in fragments', () => {
      const { container } = renderWithProviders(<TestimonialsSection />);
      expect(liveRegion(container)).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('prefers-reduced-motion', () => {
    it('does not advance on its own', () => {
      installReducedMotionControl(true);
      const { container } = renderWithProviders(<TestimonialsSection />);

      act(() => {
        vi.advanceTimersByTime(DWELL);
      });
      act(() => {
        vi.advanceTimersByTime(DWELL);
      });

      expect(shownQuote(container)).toHaveTextContent(FIRST_AUTHOR);
      expect(shownQuote(container)).not.toHaveTextContent(SECOND_AUTHOR);
    });

    it('still lets the reader drive it by hand', () => {
      installReducedMotionControl(true);
      const { container } = renderWithProviders(<TestimonialsSection />);

      fireEvent.click(screen.getByLabelText('Go to testimonial 2'));
      expect(shownQuote(container)).toHaveTextContent(SECOND_AUTHOR);
    });

    /* There is no autoplay to pause, so offering a pause button would be
       offering a control that does nothing — or worse, one that restarts what
       the preference just asked to stop. */
    it('offers no transport control', () => {
      installReducedMotionControl(true);
      renderWithProviders(<TestimonialsSection />);
      expect(screen.queryByLabelText(PAUSE_LABEL)).toBeNull();
      expect(screen.queryByLabelText(RESUME_LABEL)).toBeNull();
    });

    /* A media query read once at mount would keep whatever was true when the
       component first rendered — including for the reader who turns the
       preference on *because* of what this section is doing. */
    it('stops a running carousel when the preference is turned on mid-session', () => {
      const preference = installReducedMotionControl(false);
      const { container } = renderWithProviders(<TestimonialsSection />);

      act(() => {
        vi.advanceTimersByTime(DWELL);
      });
      expect(shownQuote(container)).toHaveTextContent(SECOND_AUTHOR);

      act(() => preference.set(true));
      act(() => {
        vi.advanceTimersByTime(DWELL);
      });
      act(() => {
        vi.advanceTimersByTime(DWELL);
      });

      expect(shownQuote(container)).toHaveTextContent(SECOND_AUTHOR);
      expect(screen.queryByLabelText(PAUSE_LABEL)).toBeNull();
    });

    it('starts again when the preference is turned back off', () => {
      const preference = installReducedMotionControl(true);
      const { container } = renderWithProviders(<TestimonialsSection />);

      act(() => preference.set(false));
      act(() => {
        vi.advanceTimersByTime(DWELL);
      });

      expect(shownQuote(container)).toHaveTextContent(SECOND_AUTHOR);
      expect(screen.getByLabelText(PAUSE_LABEL)).toBeInTheDocument();
    });
  });

  describe('the transport control', () => {
    it('carries its state in its accessible name, and only there', () => {
      renderWithProviders(<TestimonialsSection />);

      const button = screen.getByLabelText(PAUSE_LABEL);
      // One mechanism, not two: an `aria-pressed` alongside a name that already
      // says "pause" or "resume" reads as a pause button that is also pressed.
      expect(button).not.toHaveAttribute('aria-pressed');

      fireEvent.click(button);
      expect(screen.getByLabelText(RESUME_LABEL)).toBe(button);
    });

    it('leads the rail rather than hiding among its segments', () => {
      const { container } = renderWithProviders(<TestimonialsSection />);

      const buttons = [...stage(container).querySelectorAll('button')];
      expect(buttons[0]).toBe(screen.getByLabelText(PAUSE_LABEL));
      expect(buttons[1]).toBe(screen.getByLabelText('Go to testimonial 1'));
      // One transport control, six quote targets — not a seventh segment.
      expect(buttons).toHaveLength(7);
    });

    it('holds the carousel until it is pressed again', () => {
      const { container } = renderWithProviders(<TestimonialsSection />);

      fireEvent.click(screen.getByLabelText(PAUSE_LABEL));
      act(() => {
        vi.advanceTimersByTime(DWELL);
      });
      act(() => {
        vi.advanceTimersByTime(DWELL);
      });
      expect(shownQuote(container)).toHaveTextContent(FIRST_AUTHOR);

      fireEvent.click(screen.getByLabelText(RESUME_LABEL));
      act(() => {
        vi.advanceTimersByTime(DWELL);
      });
      expect(shownQuote(container)).toHaveTextContent(SECOND_AUTHOR);
    });

    /*
     * The trap. Hover pause and the explicit pause both end up calling the same
     * `pause()`, so a naive implementation lets `onMouseLeave` call `resume()`
     * and quietly undo a decision the reader made on purpose.
     */
    it('is not undone by the pointer leaving the stage', () => {
      const { container } = renderWithProviders(<TestimonialsSection />);

      fireEvent.mouseOver(stage(container));
      fireEvent.click(screen.getByLabelText(PAUSE_LABEL));
      fireEvent.mouseOut(stage(container));

      act(() => {
        vi.advanceTimersByTime(DWELL);
      });
      act(() => {
        vi.advanceTimersByTime(DWELL);
      });

      expect(shownQuote(container)).toHaveTextContent(FIRST_AUTHOR);
      expect(screen.getByLabelText(RESUME_LABEL)).toBeInTheDocument();
    });

    /* The other direction: hover is a transient courtesy and must release the
       timer on its own, without the reader having to press anything. */
    it('leaves plain hover free to pause and release by itself', () => {
      const { container } = renderWithProviders(<TestimonialsSection />);

      fireEvent.mouseOver(stage(container));
      act(() => {
        vi.advanceTimersByTime(DWELL);
      });
      expect(shownQuote(container)).toHaveTextContent(FIRST_AUTHOR);

      fireEvent.mouseOut(stage(container));
      act(() => {
        vi.advanceTimersByTime(DWELL);
      });
      expect(shownQuote(container)).toHaveTextContent(SECOND_AUTHOR);
    });
  });
});
