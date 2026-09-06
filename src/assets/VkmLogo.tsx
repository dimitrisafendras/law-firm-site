/*
 * VKM Legal — the mark, drawn.
 *
 * The same geometry as `public/favicon.svg`, so the tab icon and the header
 * mark are one design rather than two that happen to share three letters.
 *
 * Drawn as paths rather than set as text, for the reason the favicon forced:
 * the supplied artwork names no `font-family` and positions its glyphs for a
 * face it does not name, so it rendered in whatever default the browser had,
 * with the letters overlapping and its 8px white keyline running them together.
 * Paths depend on no font and render identically everywhere. The originals are
 * kept in `src/assets/brand/` — see the README there for what differs.
 *
 * Built on a 48 grid: a 16-unit cap height on a y=32 baseline, monolinear
 * strokes with round caps, letters at x=8/19/30 with 3 units of air between
 * them.
 *
 * The stroke is 2.3 here against the favicon's 3, which is the one number the
 * two do not share. At the navbar's 34px a 3-unit stroke computes to about
 * 5.4px, which reads heavier than anything else on a page set in a light
 * geometric sans. The favicon needs the extra weight for the opposite reason:
 * at 16px a thinner stroke drops below a pixel and the letters break up. The K keeps a wide aperture and the M a full-depth vertex,
 * because both are what stop the letterforms filling in when the mark is
 * scaled down.
 *
 * The K is picked out in `--brand-sky` against `--brand-navy-on-dark` for the V
 * and M — the construction the artwork is actually about, two weights of blue
 * with the middle letter lifted. `--brand-navy` itself is unusable here:
 * #002B49 on this page's #0F1A2E measures about 1.3:1, so the V and M would
 * disappear. It stays in tokens.ts for anything printed on white, and the
 * favicon uses it as a *ground* rather than as ink.
 *
 * No plate. The favicon needs one because a browser tab strip is somebody
 * else's surface and usually light; here the mark sits on the page's own ramp,
 * where a white rectangle behind it would read as a sticker.
 *
 * The viewBox is cropped to the ink — x 6.5 to 41.5, y 14.5 to 33.5 — rather
 * than left at the 48 grid, so the mark fills whatever height CSS gives it
 * instead of carrying the grid's margin as dead space.
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
      viewBox="6.5 14.5 35 19"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      fill="none"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 16 L12 32 L16 16" stroke="var(--brand-navy-on-dark)" />
      <path d="M19 16 V32 M26 16 L19.5 24 L26 32" stroke="var(--brand-sky)" />
      <path d="M30 32 V16 L35 26 L40 16 V32" stroke="var(--brand-navy-on-dark)" />
    </svg>
  );
}
