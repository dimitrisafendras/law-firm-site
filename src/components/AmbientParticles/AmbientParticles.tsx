import { useEffect, useRef } from 'react';
import { ORION_LINES, ORION_STARS } from './orion';
import './AmbientParticles.css';

const STAR_BY_ID = new Map(ORION_STARS.map((star) => [star.id, star]));

/** Faintest star 2.5px, brightest about 6px: size reads as magnitude. */
const starSize = (mag: number) => (2.5 + (4.6 - mag) * 0.8).toFixed(1);

/**
 * The constellation Orion, as a few floating lights: one per star, placed
 * where the star is in the sky and sized by its brightness (see orion.ts).
 *
 * This is the whole of the page's floating decoration, and deliberately so.
 * It began as forty-odd drifting dots across every page and was pared back to
 * the figure alone; too much floating around reads as noise, not sky. The
 * stars are joined by faint hairlines, so the whole figure drifts as one and
 * the stars only twinkle: stars wandering on their own paths would pull away
 * from their lines.
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
        {/* The box is stretched, so the lines are drawn in the stars' own
            0–100 space with `preserveAspectRatio="none"`, and their stroke is
            kept a hairline at any stretch with non-scaling-stroke. */}
        <svg className="ambient-particles__lines" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          {ORION_LINES.map(([a, b]) => {
            const from = STAR_BY_ID.get(a)!;
            const to = STAR_BY_ID.get(b)!;
            return (
              <line
                key={`${a}-${b}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
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
