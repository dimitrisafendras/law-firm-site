import { useEffect, useRef } from 'react';
import { ORION_STARS } from './orion';
import './AmbientParticles.css';

/** Faintest star 2.5px, brightest about 6px: size reads as magnitude. */
const starSize = (mag: number) => (2.5 + (4.6 - mag) * 0.8).toFixed(1);

/**
 * The constellation Orion, as a few floating lights: one per star, placed
 * where the star is in the sky and sized by its brightness (see orion.ts).
 *
 * This is the whole of the page's floating decoration, and deliberately so.
 * It began as forty-odd drifting dots across every page and was pared back to
 * the figure alone; too much floating around reads as noise, not sky. The
 * stars are not joined (lines were tried, twice, and taken out): each floats
 * on its own slow path, small enough that the figure holds.
 *
 * It is a background on every page: a fixed layer, mounted at the top of each
 * page's `main` beside its ground layer (the ramp paints an opaque gradient,
 * so anything behind `main` is never seen), with content scrolling over it.
 * The figure is spread over most of the screen rather than drawn to scale
 * (see the stylesheet).
 *
 * The markup is constant (positions and timings derive from the data alone),
 * so the prerender and the client agree. Whether the drift runs is decided
 * after mount: only while the layer is on screen and the tab is visible.
 */
export function AmbientParticles({
  below,
  inHero = false,
  className = '',
}: {
  /** Clip this fixed layer to start below the element this selector names. */
  below?: string;
  /** The hero's own copy: drawn above its dark fade, held still on scroll. */
  inHero?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;
    let visible = false;
    const sync = () =>
      layer.style.setProperty('--ambient-particle-play', visible && !document.hidden ? 'running' : 'paused');
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(layer);
    document.addEventListener('visibilitychange', sync);

    /*
     * The home page shows Orion twice, and the two copies must read as one.
     * The page-wide layer is fixed but sits behind the hero, whose dark fade
     * (over the left of the hero, under the copy) hid the stars there. So the
     * hero carries its own copy above that fade, and the page-wide copy is
     * clipped to start where the hero ends. The hero's copy cannot simply be
     * `position: fixed` — the hero's exit animation applies a filter, which
     * would make the hero its containing block mid-scroll — so it is
     * positioned in the hero and moved down by the scroll offset, which holds
     * it exactly where the fixed copy is. The hero's own `overflow: hidden`
     * then confines it to the hero, and the two meet at the hero's edge.
     */
    const above = below ? document.querySelector(below) : null;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (inHero) layer.style.transform = `translate3d(0, ${window.scrollY}px, 0)`;
      if (above) {
        const edge = Math.max(0, above.getBoundingClientRect().bottom);
        layer.style.clipPath = edge > 0 ? `inset(${edge}px 0 0 0)` : '';
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const tracks = inHero || above;
    if (tracks) {
      update();
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
    }

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      if (tracks) {
        cancelAnimationFrame(frame);
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
      }
    };
  }, [below, inHero]);

  return (
    <div
      ref={ref}
      className={`ambient-particles ${inHero ? 'ambient-particles--hero' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      aria-hidden="true"
    >
      <div className="ambient-particles__orion">
        {ORION_STARS.map((star, i) => (
          <span
            key={star.id}
            className="ambient-particles__star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${starSize(star.mag)}px`,
              height: `${starSize(star.mag)}px`,
              animationDelay: `${-i * 1.9}s`,
              animationDuration: `${12 + (i % 4) * 2.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
