import './ClassicField.css';

/**
 * The classic look's decorative layer — what CircuitField is to the digital one.
 *
 * Same job, same mechanics, opposite vocabulary: one fixed layer behind the
 * whole document, so content moves against a stationary ornament and the page
 * gains depth for the cost of a single compositing layer that never repaints.
 * Where the circuit field draws routed traces and junction nodes, this draws a
 * meander frieze under the header and along the foot of the viewport, and a
 * fluted column at either edge — the page as a portico rather than as a board.
 *
 * ── Nothing in the middle ────────────────────────────────────────────────────
 * The circuit field is a field: it covers the page and fades across it. This one
 * is a FRAME. A frieze is architecture, and architecture is what a room is built
 * out of, not what is painted across its walls — put a meander behind the
 * reading column and it stops being a building and becomes wallpaper. So the
 * ornament is pushed to the four edges and the middle is left empty.
 *
 * ── Both layers are always in the DOM ────────────────────────────────────────
 * `src/styles/classic.css` decides which of the two paints, for the reason given
 * in `src/theme/modes.ts`: the prerendered markup has to be mode-agnostic or
 * React 19 silently keeps the server's version of anything that differs. A
 * hidden `display: none` layer costs one skipped subtree per paint.
 *
 * ── Deterministic ────────────────────────────────────────────────────────────
 * Every coordinate below is a constant. This component is prerendered, so the
 * server and the client must emit byte-identical markup; CircuitField needs a
 * seeded LCG to manage that, and this one needs only arithmetic.
 */

/** One meander tile: 24 wide, 16 tall, drawn on a 4px grid. */
const TILE = 24;
const BAND = 16;

/**
 * Where the top frieze hangs. The header is fixed and ~80px tall (20px of
 * padding either side of the wordmark, 14px once scrolled), so 96 clears it at
 * both heights without the band ever touching the bar.
 */
const TOP = 96;

/** Width of each edge column zone. */
const COLUMN = 72;

/** Five flutes, evenly spaced inside the zone. */
const FLUTES = [12, 24, 36, 48, 60];

/** Where a column's shaft starts — below the top frieze, with air between. */
const COL_TOP = TOP + BAND + 28;

/** How far a column's base sits above the bottom frieze. */
const FOOT = BAND + 28;

/*
 * Every coordinate carries a half-pixel.
 *
 * A 1px stroke centred on an integer straddles two device pixels and renders as
 * two half-lit rows; centred on x.5 it lands on one. At these alphas the
 * difference is between a hairline and a smudge.
 */

/** The fret, baseline along the TOP of the band — the frieze under the header. */
const KEY_DOWN = 'M0 1.5H24M2.5 1.5V13.5H17.5V5.5H7.5V9.5H13.5';

/** The same fret mirrored, baseline along the BOTTOM — the frieze at the foot. */
const KEY_UP = 'M0 14.5H24M2.5 14.5V2.5H17.5V10.5H7.5V6.5H13.5';

/**
 * One column: a capital hint, five shafts, a base hint.
 *
 * The shafts and the base are anchored to the bottom of the viewport, which in
 * SVG can only be said as "100% of the height, shifted back by the clearance" —
 * hence the two translate groups. `y1` inside them is pre-compensated by the
 * same shift, so the shaft still begins at `COL_TOP` on screen.
 */
function Column() {
  return (
    <>
      {/* Capital: two rules, the upper one wider, the way an abacus sits over
          an echinus. */}
      <line x1="6.5" y1={COL_TOP - 10.5} x2={COLUMN - 5.5} y2={COL_TOP - 10.5} stroke="currentColor" strokeWidth="1" opacity="var(--field-alpha-mid)" />
      <line x1="9.5" y1={COL_TOP - 5.5} x2={COLUMN - 8.5} y2={COL_TOP - 5.5} stroke="currentColor" strokeWidth="1" opacity="var(--field-alpha-mid)" />

      <g transform={`translate(0,-${FOOT - 0.5})`}>
        {FLUTES.map((x) => (
          <line
            key={x}
            x1={x + 0.5}
            y1={COL_TOP + FOOT - 0.5}
            x2={x + 0.5}
            y2="100%"
            stroke="currentColor"
            strokeWidth="1"
            opacity="var(--field-alpha-mid)"
          />
        ))}
        <line x1="9.5" y1="100%" x2={COLUMN - 8.5} y2="100%" stroke="currentColor" strokeWidth="1" opacity="var(--field-alpha-mid)" />
      </g>

      {/* The lower of the two base rules — a plinth under the torus. */}
      <g transform={`translate(0,-${FOOT - 5.5})`}>
        <line x1="6.5" y1="100%" x2={COLUMN - 5.5} y2="100%" stroke="currentColor" strokeWidth="1" opacity="var(--field-alpha-mid)" />
      </g>
    </>
  );
}

export function ClassicField() {
  return (
    <div className="classic-field" aria-hidden="true">
      {/*
        * No `viewBox`. The layer is the viewport and the ornament must not
        * distort with it, so user units are left at 1:1 with CSS pixels and the
        * pieces are placed with percentages instead of being scaled.
        */}
      <svg width="100%" height="100%" fill="none" focusable="false">
        <defs>
          {/*
            * `currentColor` resolves against the pattern content's own inherited
            * `color`, which cascades down from `.classic-field` like any other
            * inherited property — so the frieze follows the layer's colour
            * without the rect having to pass anything in.
            */}
          <pattern id="classic-field-key-down" patternUnits="userSpaceOnUse" width={TILE} height={BAND}>
            <path d={KEY_DOWN} stroke="currentColor" strokeWidth="1" fill="none" />
          </pattern>
          <pattern id="classic-field-key-up" patternUnits="userSpaceOnUse" width={TILE} height={BAND}>
            <path d={KEY_UP} stroke="currentColor" strokeWidth="1" fill="none" />
          </pattern>
        </defs>

        {/*
          * Each band is a nested <svg> rather than a bare <rect>, and that is
          * load-bearing for the bottom one: `patternUnits="userSpaceOnUse"`
          * tiles the coordinate system, not the shape, so a band placed at an
          * arbitrary height would show whatever slice of the tile that height
          * happened to land on — a meander cut through the middle on every
          * viewport whose height is not a multiple of 16. A nested viewport
          * resets the origin to the band's own corner, and the tile starts
          * where the band does.
          */}
        <svg x="0" y={TOP} width="100%" height={BAND}>
          <rect x="0" y="0" width="100%" height={BAND} fill="url(#classic-field-key-down)" opacity="var(--field-alpha-strong)" />
        </svg>

        <g transform={`translate(0,-${BAND})`}>
          <svg x="0" y="100%" width="100%" height={BAND}>
            <rect x="0" y="0" width="100%" height={BAND} fill="url(#classic-field-key-up)" opacity="var(--field-alpha-mid)" />
          </svg>
        </g>

        {/* Left column. Nested for symmetry with the right one, which needs the
            nesting to express "COLUMN wide, measured in from the right edge". */}
        <svg className="classic-field__column" x="0" y="0" width={COLUMN} height="100%">
          <Column />
        </svg>

        <g transform={`translate(-${COLUMN},0)`}>
          <svg className="classic-field__column" x="100%" y="0" width={COLUMN} height="100%">
            {/* Mirrored, so the two columns face each other rather than both
                facing right. */}
            <g transform={`translate(${COLUMN},0) scale(-1,1)`}>
              <Column />
            </g>
          </svg>
        </g>
      </svg>
    </div>
  );
}
