import './DissolutionField.css';

/**
 * The page's one decorative layer: the fragments that came off the statue.
 *
 * This replaces `CircuitLines` — six hand-placed SVG arrangements, one per
 * section, drawn at 0.05–0.18 alpha under a 0.28 glass tint. In practice
 * nobody could see them, and six separate SVGs were being paid for. They were
 * also borrowed vocabulary: a circuit board has nothing to do with this site's
 * one real idea.
 *
 * The hero dissolves a marble Themis into cubes of light. This layer is where
 * those cubes went. It is a single fixed element behind the whole page, so
 * scrolling content moves against a stationary field and the page gains
 * parallax depth for nothing — and, with lensing restored, it finally gives
 * the glass something real to refract.
 *
 * The composition rule is the part that matters: density and opacity are
 * highest at the top right, where the statue stands, and fall away toward the
 * bottom left. Evenly-scattered particles would be exactly the stock effect
 * this exists to replace; a directional gradient reads as debris from a
 * specific event in a specific place.
 */

const VIEW = 1000;

/**
 * Deterministic placement.
 *
 * A seeded LCG rather than Math.random, because this component is prerendered:
 * the server and the client must emit identical markup or hydration mismatches
 * every fragment. The seed is arbitrary; it was chosen by looking at the
 * result.
 */
function makeRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

interface Fragment {
  x: number;
  y: number;
  size: number;
  kind: 'cube' | 'square';
  alpha: string;
  rotate: number;
}

function buildFragments(): Fragment[] {
  const rand = makeRandom(20260906);
  const out: Fragment[] = [];

  for (let i = 0; i < 150; i += 1) {
    const x = rand() * VIEW;
    const y = rand() * VIEW;

    // Distance from the top-right corner, normalised to 0…1.
    const dx = (VIEW - x) / VIEW;
    const dy = y / VIEW;
    const distance = Math.min(1, Math.sqrt(dx * dx + dy * dy) / Math.SQRT2);

    // Rejection sampling gives real density falloff rather than a uniform
    // scatter that merely fades — near the corner almost every candidate is
    // kept, and far from it most are discarded.
    if (rand() < distance * 0.85) continue;

    const near = distance < 0.35;
    const mid = distance < 0.62;

    out.push({
      x,
      y,
      // Cubes are the readable form and belong where the field is dense; the
      // far edge thins out into bare squares.
      kind: near || (mid && rand() > 0.5) ? 'cube' : 'square',
      size: near ? 9 + rand() * 7 : mid ? 5 + rand() * 4 : 2 + rand() * 2.5,
      alpha: near
        ? 'var(--field-alpha-strong)'
        : mid
          ? 'var(--field-alpha-mid)'
          : 'var(--field-alpha-faint)',
      rotate: Math.round(rand() * 30 - 15),
    });
  }

  return out;
}

/** Isometric wireframe cube: a hexagonal outline with three edges to centre. */
function cubePath(s: number): string {
  const w = 0.866 * s;
  const h = 0.5 * s;
  return [
    `M 0 ${-s}`,
    `L ${w} ${-h} L ${w} ${h} L 0 ${s} L ${-w} ${h} L ${-w} ${-h} Z`,
    `M 0 ${-s} L 0 0 L ${w} ${h} M 0 0 L ${-w} ${h}`,
  ].join(' ');
}

// Built once at module scope: the field never changes, and rebuilding it per
// render would put 150 objects through the allocator on every state change
// anywhere above it.
const fragments = buildFragments();

export function DissolutionField() {
  return (
    <div className="dissolution-field" aria-hidden="true">
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        preserveAspectRatio="xMaxYMin slice"
        focusable="false"
      >
        {fragments.map((f, i) =>
          f.kind === 'cube' ? (
            <path
              key={i}
              d={cubePath(f.size)}
              transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.rotate})`}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
              opacity={f.alpha}
            />
          ) : (
            <rect
              key={i}
              x={(f.x - f.size / 2).toFixed(1)}
              y={(f.y - f.size / 2).toFixed(1)}
              width={f.size.toFixed(1)}
              height={f.size.toFixed(1)}
              transform={`rotate(${f.rotate} ${f.x.toFixed(1)} ${f.y.toFixed(1)})`}
              fill="currentColor"
              opacity={f.alpha}
            />
          ),
        )}
      </svg>
    </div>
  );
}
