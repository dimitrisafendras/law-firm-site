/*
 * VKM Legal — the monogram.
 *
 * Traced from the supplied artwork (vkm-23-keyline-interlock-monogram.svg) and
 * keeping its geometry: letters at x=108/172/240 on a y=130 baseline, 110px at
 * weight 600, each carrying an 8px keyline stroke painted behind the fill.
 * Two things had to change to make it a *web* mark rather than a print one.
 *
 * ## The file names no font
 *
 * The original `<text>` elements carry no `font-family`, so they render in
 * whatever the browser happens to default to — Times on most, which is not the
 * mark anyone approved. A logo cannot be left to a fallback chain, so this
 * names a face explicitly, and names the site's own display face: the monogram
 * then reads as of a piece with the headings it sits above rather than as a
 * pasted-in graphic.
 *
 * This is still text rather than outlines. Converting the glyphs to paths is
 * the right answer for a final brand asset — it removes the font dependency
 * entirely, and it is what makes a logo safe to hand to a printer or a third
 * party — but it needs the source font and a tool this repo does not have.
 * Worth doing before the mark goes anywhere that is not this site.
 *
 * ## The keyline was drawn for white
 *
 * The artwork is navy and sky letters with a white stroke behind them
 * (`paint-order="stroke"`), which on white paper reads as the letters
 * interlocking with a cut between them. On this site's #0F1A2E ground the same
 * construction has to invert: the keyline becomes a dark rule, and the navy
 * letters become a lifted blue, because #002B49 on #0F1A2E measures about
 * 1.3:1 — that is not a colour, it is a hole where two thirds of the word
 * should be. What carries across is the construction, which is the part that
 * makes it this mark: two weights of blue with the middle letter picked out,
 * and a keyline holding the glyphs apart. See `brand` in tokens.ts, which keeps
 * the print values under their own names so the original can still be
 * reproduced for a light ground.
 *
 * The viewBox is cropped to the drawing rather than left at the artwork's
 * 420x160 — that canvas is mostly empty margin, and margin baked into a viewBox
 * becomes dead space that shrinks the mark inside whatever box CSS gives it.
 * The glyph coordinates are untouched; only the window onto them moved.
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
      viewBox="62 45 232 95"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g
        fontFamily="var(--heading)"
        fontSize="110"
        fontWeight="600"
        textAnchor="middle"
        stroke="var(--brand-keyline)"
        strokeWidth="8"
        paintOrder="stroke"
      >
        <text x="108" y="130" fill="var(--brand-navy-on-dark)">V</text>
        <text x="172" y="130" fill="var(--brand-sky)">K</text>
        <text x="240" y="130" fill="var(--brand-navy-on-dark)">M</text>
      </g>
    </svg>
  );
}
