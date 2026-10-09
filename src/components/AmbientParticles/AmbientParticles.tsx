import { useEffect, useRef } from 'react';
import './AmbientParticles.css';

/*
 * Horizontal positions, as percentages, in the order the lights are dropped on
 * narrower screens (see the nth-child rules in the stylesheet): the first
 * thirteen already span the whole width, so trimming the tail thins the field
 * without leaving one side bare.
 */
const POSITIONS = [4, 10, 18, 25, 33, 41, 49, 57, 65, 73, 81, 88, 94,
  7, 15, 28, 38, 46, 54, 62, 70, 78, 85, 91, 22, 59, 97, 35,
  12, 20, 30, 43, 51, 67, 76, 83, 93, 6, 26, 56, 72, 96] as const;

/**
 * Tiny drifting lights, the hero's ambient particles on every page.
 *
 * They began inside the hero, scoped to it, so they scrolled away with it and
 * the rest of the site had none. `fixed` makes the same lights a viewport
 * layer, like CircuitField, so content scrolls over a field that stays put.
 * Mount it inside `main.page-ramp`, beside the page's ground: the ramp paints
 * an opaque gradient, and anything behind `main` is never seen.
 *
 * `below` names an element the fixed layer should start under. The home
 * page's hero carries its own layer, above its text scrim (which is opaque on
 * the left and would hide a layer behind it), so the site-wide one is clipped
 * to begin where the hero ends rather than doubling the field over it.
 *
 * The markup is constant (positions, sizes and timings are derived from the
 * index alone), so the prerender and the client agree. Whether the drift runs
 * is decided after mount: only while the layer is on screen and the tab is
 * visible.
 */
export function AmbientParticles({
  fixed = false,
  below,
  className = '',
}: {
  fixed?: boolean;
  below?: string;
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

    const above = below ? document.querySelector(below) : null;
    let frame = 0;
    const clip = () => {
      frame = 0;
      const edge = Math.max(0, above!.getBoundingClientRect().bottom);
      layer.style.clipPath = edge > 0 ? `inset(${edge}px 0 0 0)` : '';
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(clip);
    };
    if (above) {
      clip();
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
    }

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      if (above) {
        cancelAnimationFrame(frame);
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
      }
    };
  }, [below]);

  return (
    <div
      ref={ref}
      className={`ambient-particles ${fixed ? 'ambient-particles--fixed' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      aria-hidden="true"
    >
      {POSITIONS.map((left, i) => (
        <span
          key={left}
          style={{
            left: `${left}%`,
            top: `${5 + ((i * 37) % 89)}%`,
            width: `${2 + (i % 2)}px`,
            height: `${2 + (i % 2)}px`,
            animationDelay: `${-i * 2.3}s`,
            animationDirection: i % 2 ? 'alternate-reverse' : 'alternate',
            animationDuration: `${15 + (i % 5) * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
