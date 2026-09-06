import monogram from './vkm-monogram.svg';

/*
 * VKM Legal — the supplied monogram, rendered as the file.
 *
 * `vkm-monogram.svg` is the client's artwork verbatim; only its 8KB C2PA
 * metadata block is stripped, since that would otherwise ship on every page
 * load. Nothing is reinterpreted — glyph positions, the 110px/600 sizing, the
 * navy and sky fills and the 8px white keyline are all the file's own.
 *
 * An <img>, not inlined markup, on purpose: inlining hands page CSS a way to
 * reach inside and change the colours or the face, which is how an earlier
 * revision ended up rendering something that was not the client's logo.
 *
 * Two known consequences of shipping it as drawn, both verified in Chrome and
 * both accepted for now rather than hidden:
 *
 * - The file names no `font-family`, so it renders in the browser's default
 *   serif rather than the site's sans.
 * - Its glyphs are positioned absolutely for a face it does not name; measured,
 *   they overlap before the 8px keyline widens each by a further 8 per side, so
 *   the white strokes run together at small sizes.
 *
 * Fixing either means changing the artwork, which is the client's call. See
 * `src/assets/brand/README.md`.
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
  return <img src={monogram} className={className} alt={title ?? ''} draggable={false} />;
}
