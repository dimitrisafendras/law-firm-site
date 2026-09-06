import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import legalWhite from './vkm-legal-white.svg';
import monogramWhite from './vkm-monogram-white.svg';

/*
 * VKM Legal — the supplied artwork, as drawn.
 *
 * `src/assets/brand/` holds the four files the client supplied, verbatim but
 * for their C2PA manifests (about 10KB of base64 apiece that is provenance for
 * the file rather than part of the drawing, and would otherwise ship on every
 * page load). The two files imported here are those same drawings with nothing
 * changed but the viewBox, cropped to the ink.
 *
 * ─── Why this is an <img> again ──────────────────────────────────────────────
 *
 * These glyphs are outlined `<path>` data. The previous artwork was live
 * `<text>` naming no `font-family`, which is a drawing that depends on a font
 * being present wherever it is opened — and an SVG loaded through <img> is an
 * isolated document that gets none of the embedding page's webfonts, so the
 * mark rendered in whatever serif the browser defaulted to. That is what forced
 * the drawing inline into this component: inlining was the only way to get the
 * site's own face into it.
 *
 * Outlines have no such dependency, so the reason to inline is gone and the
 * reason not to is back: markup in the page is markup page CSS can reach into
 * and repaint, which is how an earlier revision ended up rendering something
 * that was not the client's logo. An <img> cannot be reached into. The file on
 * disk is the artwork, and what ships is what they drew.
 *
 * ─── The two boxes are not interchangeable at a given height ─────────────────
 *
 * Measured with `getBBox` in the browser, keyline included (stroke-width 8, so
 * 4 units beyond the outline on every side; the LEGAL row carries no stroke):
 *
 *   legal     viewBox 95.34 59 229.32 125.01   glyphs 86.32 units of 125.01
 *   monogram  viewBox 95.34 49 229.32 86.32    glyphs 86.32 units of 86.32
 *
 * So at an equal CSS `height` the monogram's letters render about 45% larger —
 * its box is the glyphs and nothing else, while the wordmark's also carries the
 * LEGAL row and the air above it. Concretely, `glyph = height x 86.32/125.01`
 * for the wordmark and `glyph = height` for the monogram. `src/App.css` sizes
 * the navbar around that; the arithmetic lives there.
 *
 * One measurement worth carrying: LEGAL is 14.43 units tall, so it renders at
 * `height x 14.43/125.01` — 6.5px in the 56px navbar and 8.3px in the 72px
 * footer. It is also right-aligned under the M rather than centred under the
 * whole mark. Both are how the artwork is drawn, and neither is this
 * component's to correct.
 *
 * The favicon does not use either file. A favicon document gets neither the
 * stylesheet nor a second chance at legibility, and three interlocked glyphs
 * close into a single dot at 16px — `public/favicon.svg` is drawn geometry for
 * that reason.
 */

export type VkmLogoVariant = 'wordmark' | 'monogram';

/*
 * Which drawing an ancestor wants, for the marks it does not construct itself.
 *
 * The navbar takes its logo as an opaque `ReactNode` that each page builds —
 * anchor, aria-label and all — so it has no prop to hand down and no business
 * knowing what is inside. It publishes the variant it wants and any VkmLogo in
 * that subtree picks it up. An explicit `variant` still wins, so a caller with
 * an opinion is never overruled by where it happens to sit.
 */
const VariantContext = createContext<VkmLogoVariant>('wordmark');

export function VkmLogoVariantProvider({
  variant,
  children,
}: {
  variant: VkmLogoVariant;
  children: ReactNode;
}) {
  return <VariantContext.Provider value={variant}>{children}</VariantContext.Provider>;
}

interface VkmLogoProps {
  className?: string;
  /**
   * Accessible name. Omit inside an element that already names itself — the
   * navbar anchor carries its own `aria-label`, and a name here as well would
   * announce the firm twice.
   */
  title?: string;
  /**
   * Which drawing to render. Left off, it follows the nearest
   * `VkmLogoVariantProvider`, and defaults to the full wordmark.
   */
  variant?: VkmLogoVariant;
}

export function VkmLogo({ className, title, variant }: VkmLogoProps) {
  const inherited = useContext(VariantContext);
  const monogram = (variant ?? inherited) === 'monogram';

  return (
    <img
      src={monogram ? monogramWhite : legalWhite}
      className={className}
      alt={title ?? ''}
      draggable={false}
    />
  );
}
