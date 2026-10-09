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
 * It began as forty-odd drifting dots across every page, then gained Orion,
 * then lines between its stars and a scatter of faint background stars; the
 * owner pared it back each time, to the figure alone, unjoined. Too much
 * floating around reads as noise, not sky.
 *
 * The figure is spread across the whole area rather than drawn to scale (see
 * the stylesheet). Each star floats on its own slow path, wide enough to read
 * as floating and small enough that the figure holds. The layer scrolls with the page rather
 * than being pinned to the viewport: the home page draws it in the hero, and
 * other pages mount it at the top of `main`, beside their ground layer (the
 * ramp paints an opaque gradient, so anything behind `main` is never seen).
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
    <div ref={ref} className={`ambient-particles ${className}`.trim()} aria-hidden="true">
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
