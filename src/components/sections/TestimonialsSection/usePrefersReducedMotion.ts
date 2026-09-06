import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function readPreference(): boolean {
  // jsdom without the stub, and any prerender pass, have no matchMedia. Assume
  // full motion there: it is the common case, so the markup a prerender emits
  // matches what most browsers hydrate into and there is nothing to reconcile.
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(QUERY).matches;
}

/**
 * Whether the reader has asked the OS to reduce motion.
 *
 * A `matches` read at mount is not enough. The preference is a system setting a
 * reader can flip at any moment — often *because* something on the page is
 * moving — and a one-shot read would keep whatever was true when the component
 * first rendered until a reload. The subscription is the point: the listener
 * makes the answer live, so turning the preference on stops an already-running
 * carousel and turning it off starts one.
 *
 * Lives beside the carousel because it is the only caller today. It is not
 * carousel-specific, though — see the note in the section's report about
 * hoisting it to a shared hooks module.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(readPreference);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduced(mq.matches);

    // Re-read on mount rather than trusting the initialiser: on a prerendered
    // page that initialiser ran without a `window`, and even in the browser the
    // preference can change between first render and this effect.
    onChange();

    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
