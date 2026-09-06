import { createContext, useContext, type ReactNode } from 'react';

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
 * Inlined markup, not an <img> — and it was an <img> for exactly one good
 * reason, which no longer outweighs the cost.
 *
 * The reason: inlining hands page CSS a way to reach inside and change the
 * colours or the face, which is how an earlier revision ended up rendering
 * something that was not the client's logo. That risk is real and it is met
 * here by stating every fill, stroke and family as an attribute on the element
 * rather than leaving any of them to inherit.
 *
 * The cost: an SVG loaded through <img> is an isolated document. It gets none
 * of the embedding page's webfonts — so LEGAL, which names Jura, rendered in
 * the same serif fallback as the glyphs. A sub-label set in Times under a page
 * set in Jura is not a subtle mismatch, and there is no way to fix it from
 * outside the file. Inlined, the row is part of this document and takes the
 * site's own face.
 *
 * The two `.svg` files this used to import are gone with the change: their only
 * remaining content was the two viewBox crops, which now live below. The four
 * supplied originals are untouched in `src/assets/brand/`.
 *
 * The one thing still unsettled is the face. The file names no `font-family`,
 * so it renders in whatever the browser defaults to rather than the site's own
 * — see `src/assets/brand/README.md`. Fixing it means changing the artwork.
 * The favicon does not use this file at all, for the same reason: it is drawn
 * geometry, because a favicon document gets neither the stylesheet nor the
 * webfonts.
 *
 * One measurement worth carrying: LEGAL is 22px against 110px glyphs, so its
 * rendered size is `height x 22/140`. At the navbar's 56px that is 8.8px and at
 * the footer's 72px it is 11.3px. It was 14px, i.e. 5.6px in the bar, which is
 * below the size at which tracked-out caps are a word rather than a texture.
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
 * It is a different viewBox on the same three glyphs rather than a CSS crop,
 * because a crop would have to live in a stylesheet — which is the reach-inside
 * this component exists to prevent.
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

/*
 * The three glyphs, identical in both drawings — same x positions, same
 * font-size, same 8px navy keyline painted behind the fill.
 *
 * `font-family` is stated rather than left off, and stating it is a fix rather
 * than a liberty. The supplied files name no face, so until now every glyph
 * fell back to whatever the renderer happened to default to — Times here, and
 * something else on a machine without it. That is not the mark being drawn in a
 * serif on purpose; it is the mark being drawn in a different face per visitor.
 * Naming the fallback explicitly freezes what this page already renders today
 * and makes it the same everywhere, without changing a single letterform.
 *
 * Deliberately NOT the site's own face. Retypesetting the client's monogram in
 * Jura would be redrawing their logo, and the x positions here were fitted to a
 * face with these metrics — see src/assets/brand/README.md, which measures the
 * overlap. Choosing the mark's typeface is the client's call.
 */
const GLYPH_FACE = "'Times New Roman', Times, serif";

function Glyphs({ baseline }: { baseline: number }) {
  const common = {
    y: baseline,
    textAnchor: 'middle' as const,
    fontSize: 110,
    fontWeight: 600,
    fontFamily: GLYPH_FACE,
    stroke: '#002B49',
    strokeWidth: 8,
    paintOrder: 'stroke',
  };
  return (
    <>
      <text x={108} {...common} fill="#FFFFFF">V</text>
      <text x={172} {...common} fill="#BCE8FF">K</text>
      <text x={240} {...common} fill="#FFFFFF">M</text>
    </>
  );
}

export function VkmLogo({ className, title, variant }: VkmLogoProps) {
  const inherited = useContext(VariantContext);
  const monogram = (variant ?? inherited) === 'monogram';

  /* A name when one is given, and out of the accessibility tree entirely when
     not — the navbar anchor and the footer link already name themselves, and a
     second name there announces the firm twice. */
  const naming = title
    ? ({ role: 'img', 'aria-label': title } as const)
    : ({ 'aria-hidden': true, focusable: false } as const);

  return (
    <svg
      className={className}
      viewBox={monogram ? '60 40 240 100' : '60 50 240 140'}
      {...naming}
    >
      <Glyphs baseline={monogram ? 130 : 140} />
      {!monogram && (
        /*
          LEGAL, and the reason this component stopped being an <img>.

          An SVG loaded through <img> is an isolated document: it gets no
          webfonts from the page that embeds it, so this row rendered in the
          same serif fallback as the glyphs — a Times sub-label under a page set
          in Jura, which is what "not proper" was. Inlined, the row is part of
          this document and takes the site's own label face.

          `textLength` spans it across the glyph ink measured in the browser
          (69.3 to 289.1, keyline included) rather than across the viewBox, so it
          sits on the mark's axis instead of overhanging both ends.
          `lengthAdjust="spacing"` distributes to the gaps and leaves the
          letterforms alone, which is what makes it read as tracked caps rather
          than as stretched ones.
        */
        <text
          x={69.3}
          y={182}
          textAnchor="start"
          textLength={219.8}
          lengthAdjust="spacing"
          fontSize={22}
          fontWeight={500}
          fontFamily="Jura, sans-serif"
          fill="#FFFFFF"
        >
          LEGAL
        </text>
      )}
    </svg>
  );
}
