import './CircuitField.css';

/**
 * The page's one decorative layer: a circuit network, fixed behind everything.
 *
 * This began as six per-section `CircuitLines` variants — hand-placed
 * arrangements at 0.05–0.18 alpha, invisible under a 0.28 glass tint, and paid
 * for six times over. The fix was never the vocabulary; it was that they were
 * scoped per section, so they scrolled with their content and never read as
 * one thing.
 *
 * One fixed layer instead. Because it does not scroll, content moves against a
 * stationary network and the page gains parallax depth for nothing — no
 * transform, no scroll listener, one compositing layer that never repaints —
 * and, with lensing restored, the glass finally has something real to refract.
 *
 * The composition rule is what stops it reading as wallpaper: trace density,
 * length and opacity are highest at the top right, where the statue's own
 * circuit grid sits in the hero, and fall away toward the bottom left. The
 * network is denser where it comes from.
 */

const VIEW = 1000;

/**
 * Deterministic placement.
 *
 * A seeded LCG rather than Math.random, because this component is prerendered:
 * the server and the client must emit identical markup or hydration mismatches
 * on every trace.
 */
function makeRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

interface Trace {
  d: string;
  alpha: string;
  width: number;
}

interface Node {
  x: number;
  y: number;
  r: number;
  alpha: string;
}

/** 0 at the top-right corner, 1 at the bottom-left. */
function falloff(x: number, y: number): number {
  const dx = (VIEW - x) / VIEW;
  const dy = y / VIEW;
  return Math.min(1, Math.sqrt(dx * dx + dy * dy) / Math.SQRT2);
}

function alphaFor(distance: number): string {
  if (distance < 0.35) return 'var(--field-alpha-strong)';
  if (distance < 0.62) return 'var(--field-alpha-mid)';
  return 'var(--field-alpha-faint)';
}

function buildField(): { traces: Trace[]; nodes: Node[] } {
  const rand = makeRandom(20260906);
  const traces: Trace[] = [];
  const nodes: Node[] = [];

  /*
   * Traces run on a coarse grid rather than at free angles. A circuit reads as
   * a circuit because its runs are orthogonal and its turns are square — at
   * arbitrary angles the same lines read as a constellation.
   */
  const STEP = VIEW / 14;
  const snap = (v: number) => Math.round(v / STEP) * STEP;

  for (let i = 0; i < 120; i += 1) {
    const x = snap(rand() * VIEW);
    const y = snap(rand() * VIEW);
    const distance = falloff(x, y);

    // Rejection sampling gives real density falloff rather than a uniform
    // scatter that merely fades: near the corner almost every candidate
    // survives, far from it most are discarded.
    if (rand() < distance * 0.8) continue;

    const alpha = alphaFor(distance);
    // Long runs near the source, short stubs at the far edge.
    const run = snap((1.4 - distance) * (2 + rand() * 4) * STEP) || STEP;
    const horizontal = rand() > 0.42;

    if (rand() > 0.66) {
      // An L-bend — one square turn, which is what makes a run read as routed
      // rather than as a stray rule.
      const leg = snap(run * (0.35 + rand() * 0.4)) || STEP;
      traces.push({
        d: horizontal
          ? `M ${x} ${y} H ${x + run} V ${y + leg}`
          : `M ${x} ${y} V ${y + run} H ${x + leg}`,
        alpha,
        width: 0.7,
      });
      nodes.push({
        x: horizontal ? x + run : x + leg,
        y: horizontal ? y + leg : y + run,
        r: distance < 0.35 ? 2.4 : 1.6,
        alpha,
      });
    } else {
      traces.push({
        d: horizontal ? `M ${x} ${y} H ${x + run}` : `M ${x} ${y} V ${y + run}`,
        alpha,
        width: 0.7,
      });
      // Only the denser end of the field gets terminal nodes; out at the thin
      // edge a dot on every stub reads as noise.
      if (distance < 0.55) {
        nodes.push({
          x: horizontal ? x + run : x,
          y: horizontal ? y : y + run,
          r: distance < 0.35 ? 2.4 : 1.6,
          alpha,
        });
      }
    }
  }

  return { traces, nodes };
}

// Built once at module scope: the field never changes, and rebuilding it per
// render would put hundreds of objects through the allocator on every state
// change anywhere above it.
const { traces, nodes } = buildField();

export function CircuitField() {
  return (
    <div className="circuit-field" aria-hidden="true">
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        preserveAspectRatio="xMaxYMin slice"
        fill="none"
        focusable="false"
      >
        {traces.map((trace, i) => (
          <path
            key={`t${i}`}
            d={trace.d}
            stroke="currentColor"
            strokeWidth={trace.width}
            opacity={trace.alpha}
          />
        ))}
        {nodes.map((node, i) => (
          <circle
            key={`n${i}`}
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill="currentColor"
            opacity={node.alpha}
          />
        ))}
      </svg>
    </div>
  );
}
