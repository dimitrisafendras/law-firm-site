import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

/**
 * Global test environment.
 *
 * Everything here exists because jsdom does not implement a browser API the app
 * genuinely touches. Nothing here changes app behaviour — the stubs are inert
 * defaults (no media query matches, no element is ever intersecting) so a test
 * that cares must opt in explicitly rather than inherit a lucky default.
 */

type MediaQueryMatcher = (query: string) => boolean;

/** Default: nothing matches — including `prefers-reduced-motion: reduce`, so
 *  components take their normal, animated path unless a test says otherwise. */
let matchMediaMatcher: MediaQueryMatcher = () => false;

/**
 * Control what `window.matchMedia(...)` reports for the rest of the current test.
 *
 * ```ts
 * setMatchMedia((query) => query.includes('prefers-reduced-motion'));
 * ```
 * Reset automatically before each test.
 */
export function setMatchMedia(matcher: MediaQueryMatcher): void {
  matchMediaMatcher = matcher;
}

function createMediaQueryList(query: string): MediaQueryList {
  const listeners = new Set<EventListenerOrEventListenerObject>();

  const mql: MediaQueryList = {
    get matches() {
      return matchMediaMatcher(query);
    },
    media: query,
    onchange: null,
    // Deprecated pair, still called by some libraries.
    addListener: (listener) => {
      if (listener) listeners.add(listener as EventListener);
    },
    removeListener: (listener) => {
      if (listener) listeners.delete(listener as EventListener);
    },
    addEventListener: (_type: string, listener: EventListenerOrEventListenerObject | null) => {
      if (listener) listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: EventListenerOrEventListenerObject | null) => {
      if (listener) listeners.delete(listener);
    },
    dispatchEvent: (event: Event) => {
      for (const listener of listeners) {
        if (typeof listener === 'function') listener(event);
        else listener.handleEvent(event);
      }
      return true;
    },
  };

  return mql;
}

/**
 * An IntersectionObserver a test can drive.
 *
 * `FadeInSection` and `StatsBar` only ever reveal content from an observer
 * callback, and jsdom never fires one on its own — without this, scroll-revealed
 * content would simply never appear and every such test would look broken.
 */
export interface MockIntersectionObserver extends IntersectionObserver {
  readonly observed: readonly Element[];
  /** Fire the observer callback for the elements it is watching. */
  trigger(isIntersecting: boolean): void;
}

const intersectionObservers = new Set<MockIntersectionObserver>();

/** Every IntersectionObserver constructed during the current test. */
export function getIntersectionObservers(): readonly MockIntersectionObserver[] {
  return [...intersectionObservers];
}

/**
 * Make every element currently under observation intersect (or stop
 * intersecting). This is how a test reveals scroll-triggered content without
 * depending on scrolling, layout, or an animation finishing.
 */
export function triggerIntersection(isIntersecting = true): void {
  for (const observer of intersectionObservers) observer.trigger(isIntersecting);
}

class MockIntersectionObserverImpl implements MockIntersectionObserver {
  readonly root: Element | Document | null;
  readonly rootMargin: string;
  readonly thresholds: readonly number[];

  private readonly callback: IntersectionObserverCallback;
  private readonly elements = new Set<Element>();

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.root = (options?.root as Element | Document | null | undefined) ?? null;
    this.rootMargin = options?.rootMargin ?? '0px';
    const threshold = options?.threshold ?? 0;
    this.thresholds = Array.isArray(threshold) ? threshold : [threshold];
    intersectionObservers.add(this);
  }

  get observed(): readonly Element[] {
    return [...this.elements];
  }

  observe(element: Element): void {
    this.elements.add(element);
  }

  unobserve(element: Element): void {
    this.elements.delete(element);
  }

  disconnect(): void {
    this.elements.clear();
    intersectionObservers.delete(this);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  trigger(isIntersecting: boolean): void {
    const entries = [...this.elements].map(
      (target) =>
        ({
          target,
          isIntersecting,
          intersectionRatio: isIntersecting ? 1 : 0,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: 0,
        }) as IntersectionObserverEntry,
    );
    if (entries.length > 0) this.callback(entries, this);
  }
}

class MockResizeObserver implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

function installBrowserStubs(): void {
  vi.stubGlobal('matchMedia', (query: string) => createMediaQueryList(query));
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserverImpl);
  vi.stubGlobal('ResizeObserver', MockResizeObserver);

  // jsdom implements neither, and both are called by animated components.
  if (typeof window.scrollTo !== 'function') {
    vi.stubGlobal('scrollTo', () => {});
  }
  if (typeof Element.prototype.scrollIntoView !== 'function') {
    Element.prototype.scrollIntoView = () => {};
  }
}

installBrowserStubs();

beforeEach(() => {
  // A test starts with no stored preference: no saved language, and edit mode
  // locked — which is the production default.
  window.localStorage.clear();
  window.sessionStorage.clear();

  matchMediaMatcher = () => false;
  intersectionObservers.clear();
  installBrowserStubs();
});

afterEach(() => {
  cleanup();
  intersectionObservers.clear();
  window.localStorage.clear();
  window.sessionStorage.clear();
});
