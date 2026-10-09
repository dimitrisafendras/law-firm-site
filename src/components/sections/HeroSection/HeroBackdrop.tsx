import { useEffect, useRef } from 'react';

/**
 * The hero's desktop scrim, painted as part of the page's background stack
 * instead of inside the hero.
 *
 * The hero is its own stacking context (its scroll-driven exit carries a mask),
 * so a layer outside it can only sit wholly above it or wholly below it. The
 * Orion stars have to go in between: above this dark fade, so they are not
 * lost under it, and below the statue and the copy. Moving the fade out of the
 * hero is what makes that order possible:
 *
 *   circuit field → this fade → stars → hero (statue, copy) → sections → footer
 *
 * It mirrors the hero's box: absolutely placed at the top of `main`, given the
 * hero's height by a ResizeObserver (a resize, never a scroll, so it cannot lag
 * behind scrolling), and it wears the same scroll-driven exit as the hero, on
 * the same geometry, so the two leave as one.
 *
 * Desktop only. Below the mobile breakpoint the fade has to cover the statue
 * as well, to put the copy on a dark ground where it overlaps the figure, so
 * there it stays inside the hero (`.hero-section__bg-fade`).
 */
export function HeroBackdrop({ hero = '.hero-section' }: { hero?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const target = document.querySelector(hero);
    if (!layer || !target) return;
    const observer = new ResizeObserver(() => {
      layer.style.height = `${(target as HTMLElement).offsetHeight}px`;
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [hero]);

  return (
    <div ref={ref} className="hero-backdrop" aria-hidden="true">
      <div className="hero-backdrop__fade" />
    </div>
  );
}
