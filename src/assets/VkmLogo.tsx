/*
 * VKM Legal — the monogram.
 *
 * This is the supplied artwork (`brand/vkm-monogram-source.svg`) with three
 * changes, each forced by something the file could not settle for itself. The
 * letters, their order, and the idea that the K is picked out against its
 * neighbours are all the artwork's.
 *
 * ## The white keyline is gone
 *
 * The source paints an 8px white stroke behind each glyph. On white paper that
 * is the interlock the file is named for — the paper showing through where two
 * letters cross. Rendered on this page it was three white outlines that ran
 * into each other and read as a smudge, which is what it looked like in Chrome
 * and why it was dropped.
 *
 * ## The letters are spaced by the font, not by coordinate
 *
 * The artwork positions each glyph absolutely (x=108/172/240). Those numbers
 * were spaced for whatever face it was drawn in, which the file does not name;
 * in any face measured here the glyphs already overlapped before the 8px stroke
 * widened each of them by a further 8 per side. One `<text>` with three tspans
 * lets the font's own metrics do it, so the spacing is right in whatever face
 * this ends up set in, rather than right in one and broken everywhere else.
 *
 * ## The navy is lifted
 *
 * #002B49 on this page's #0F1A2E measures about 1.3:1 — with the white keyline
 * removed, V and M simply disappeared. `--brand-navy-on-dark` is the same hue
 * carried up until it reads. The K keeps #89CFF0 exactly as drawn, because on
 * a dark ground it already worked. `--brand-navy` still holds the drawn value
 * for anything printed on white.
 *
 * The face is Jura, the site's display face, so the mark belongs to the page it
 * sits on. Left unset, as the artwork leaves it, a browser falls back to its
 * default serif — which is what shipped for one revision and looked like a
 * different company.
 */

interface VkmLogoProps {
  className?: string;
  /**
   * Accessible name. Omit inside an element that already names itself — the
   * navbar anchor carries its own `aria-label`, and a name here as well would
   * announce the firm twice.
   */
  title?: string;
}

export function VkmLogo({ className, title }: VkmLogoProps) {
  return (
    <svg
      className={className}
      /* Framed to the ink, not the em box. The three caps have no descender, so
         the glyphs run from the baseline (y=48) up by Jura's cap height to
         about y=7, and span x=39.1 to 160.9 — measured, not guessed. Framing
         the em box instead would bake ~20 units of dead space above and below
         into the viewBox, which then shrinks the mark inside whatever height
         CSS gives it. */
      viewBox="37 5 127 45"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <text
        x="100"
        y="48"
        textAnchor="middle"
        fontFamily="var(--heading)"
        fontSize="56"
        fontWeight="700"
        letterSpacing="2"
      >
        <tspan fill="var(--brand-navy-on-dark)">V</tspan>
        <tspan fill="var(--brand-sky)">K</tspan>
        <tspan fill="var(--brand-navy-on-dark)">M</tspan>
      </text>
    </svg>
  );
}
