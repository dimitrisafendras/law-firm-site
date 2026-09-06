import { createContext, useContext, type ReactNode } from 'react';
import wordmarkWhite from './vkm-wordmark-white.svg';
import monogramWhite from './vkm-monogram-white.svg';

/*
 * VKM Legal — the supplied white wordmark.
 *
 * `brand/vkm-wordmark-white.svg` verbatim (its C2PA metadata block stripped,
 * since that would otherwise ship on every page load): white V and M, the K in
 * #BCE8FF, each carrying an 8px #002B49 keyline painted behind the fill, over a LEGAL
 * sub-label in #1A6B8A.
 *
 * This is the dark-ground variant, and it is the right one here for a reason
 * the navy pair could not meet: white on this page's #0F1A2E is legible, where
 * #002B49 on it measures about 1.3:1. Its K is also #BCE8FF, which is this
 * site's `--accent` exactly — the mark and the page already agree on that
 * colour.
 *
 * The keyline works on a dark ground too, and does the job it was drawn for.
 * On the navy variant the keyline is white, so on this page it read as three
 * bright outlines colliding into a smudge. Here it is navy against a navy
 * ground, so where the glyphs overlap it reads as a cut between them rather
 * than as an outline around them — which is what "keyline interlock" means.
 *
 * An <img>, not inlined markup: inlining hands page CSS a way to reach inside
 * and change the colours or the face, which is how an earlier revision ended up
 * rendering something that was not the client's logo.
 *
 * The one thing still unsettled is the face. The file names no `font-family`,
 * so it renders in whatever the browser defaults to rather than the site's own
 * — see `src/assets/brand/README.md`. Fixing it means changing the artwork.
 * The favicon does not use this file at all, for the same reason: it is drawn
 * geometry, because a favicon document gets neither the stylesheet nor the
 * webfonts.
 *
 * One measurement worth carrying: LEGAL is 14px against 110px glyphs, so its
 * rendered size is `height x 14/140`. At the navbar's 56px that is 5.6px and at
 * the footer's 72px it is 7.2px — legible in the footer, marginal in the bar.
 * The separate HTML tagline that used to sit under the mark is gone, since the
 * wordmark now carries those words itself and rendering them twice was the
 * thing to avoid.
 *
 * ─── The monogram variant ────────────────────────────────────────────────────
 *
 * `vkm-monogram-white.svg` is the same three glyphs without the LEGAL row, for
 * the one place the sub-label stops earning its space: the scrolled header,
 * where the bar tightens and 5.6px of tracked-out caps is a grey smear rather
 * than a word. Dropping the row is the honest fix — shrinking the whole mark to
 * fit a label nobody can read shrinks the letters too.
 *
 * It is a separate file rather than a CSS crop of the wordmark because the two
 * are different drawings, and because a crop would have to live in a stylesheet
 * — which is the reach-inside this component exists to prevent.
 *
 * The two boxes are NOT interchangeable at a given CSS height. The wordmark's
 * viewBox is 140 units tall and its glyphs are 110 of them; the monogram is
 * cropped to the glyphs alone, 100 units tall for the same 110-unit letters. So
 * the same `height` draws the monogram's letters 40% larger. The header sizes
 * around that — see `.navbar--scrolled` in src/App.css, which carries the
 * arithmetic.
 */

export type VkmLogoVariant = 'wordmark' | 'monogram';

/*
 * Which drawing an ancestor wants, for the marks it does not construct itself.
 *
 * The navbar takes its logo as an opaque `ReactNode` that each page builds —
 * anchor, aria-label and all — so it has no prop to hand down and no business
 * knowing there is an <img> in there. It publishes the variant it wants and any
 * VkmLogo in that subtree picks it up. An explicit `variant` still wins, so a
 * caller that has an opinion is never overruled by where it happens to sit.
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
  const resolved = variant ?? inherited;

  return (
    <img
      src={resolved === 'monogram' ? monogramWhite : wordmarkWhite}
      className={className}
      alt={title ?? ''}
      draggable={false}
    />
  );
}
