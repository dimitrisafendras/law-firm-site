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
 * One layer, and nothing moves it but the browser. The home page once drew a
 * second copy inside the hero, counter-scrolled from script so it would sit
 * on top of the page-wide one; script runs a frame behind compositor
 * scrolling, so mid-scroll the two parted and the figure showed twice. On the
 * home page the single layer is instead mounted after the hero and raised
 * over it (see the stylesheet).
 *
 * The markup is constant (positions and timings derive from the data alone),
 * so the prerender and the client agree. Whether the drift runs is decided
 * after mount: only while the layer is on screen and the tab is visible.
 */
export function AmbientParticles({ className = '' }: { className?: string }) {
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
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`ambient-particles ${className}`.trim()}
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
              animationDuration: `${8 + (i % 4) * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
