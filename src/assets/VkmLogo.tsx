import { createContext, useContext, useId, useMemo } from 'react';
import type { ReactNode } from 'react';
import legalRaw from './vkm-legal-white.svg?raw';
import monogramRaw from './vkm-monogram-white.svg?raw';

/*
 * VKM Legal — the supplied artwork, as drawn.
 *
 * `src/assets/brand/` holds the four files the client supplied, verbatim but
 * for their C2PA manifests (about 10KB of base64 apiece that is provenance for
 * the file rather than part of the drawing, and would otherwise ship on every
 * page load). The two files imported here are those same drawings with nothing
 * changed but the viewBox, cropped to the ink.
 *
 * ─── Why this is inline markup, and what keeps it honest ────────────────────
 *
 * This was an <img> on purpose, and that reasoning is worth keeping in view:
 * these glyphs are outlined `<path>` data with no font dependency, so there was
 * nothing to gain from inlining, and one clear thing to lose — markup in the
 * page is markup page CSS can reach into and repaint, which is how an earlier
 * revision ended up rendering something that was not the client's logo. An
 * <img> cannot be reached into.
 *
 * What changed is a requirement, not an opinion: the mark has to follow the
 * palette. The site ships eighteen colour schemes, and a flat white drawing is
 * invisible on the nine light ones — the previous answer was to `invert()` the
 * whole image and rotate its hue, which is not colour management, it is a
 * guess that happened to land near the brand's teal. And the K, which the
 * artwork picks out in the brand's blue, could not track the accent at all.
 * Neither is fixable from outside an <img>.
 *
 * So the drawing is inlined, and the protection moves from "unreachable" to
 * "checked". The .svg files on disk are still the artwork and still the source
 * of truth — nothing here redraws them. `themed()` below performs exactly two
 * substitutions, both asserted: the K's fill and the letters' fill become
 * custom properties, and everything else, geometry and masks included, is
 * passed through untouched. Replace either file with a drawing whose fills do
 * not match and the module throws on load rather than quietly shipping a
 * mis-painted mark.
 *
 * ─── The interlock is a cut, not a line ─────────────────────────────────────
 *
 * There is no keyline stroke. Each file's `<defs>` masks the K's dilated
 * outline out of the V and the M's out of the K, so where the letters overlap
 * the drawing is transparent and the page shows through. That is why the mark
 * needs no ground of its own and why nothing here paints navy on a dark page.
 *
 * It also means the ink is exactly the path geometry, with nothing extending
 * past it — so the crops below are tighter than the ones the previous artwork
 * needed, and every ratio was re-measured rather than carried across.
 *
 * ─── The two boxes are not interchangeable at a given height ─────────────────
 *
 * Measured with `getBBox` in the browser, excluding the mask definitions (their
 * rects are 700x520 and would swamp the box):
 *
 *   legal     viewBox 99.34 63 221.32 121.01   glyphs 78.32 units of 121.01
 *   monogram  viewBox 99.34 53 221.32 78.32    glyphs 78.32 units of 78.32
 *
 * So at an equal CSS `height` the monogram's letters render about 55% larger —
 * its box is the glyphs and nothing else, while the wordmark's also carries the
 * LEGAL row and the air above it. Concretely, `glyph = height x 78.32/121.01`
 * for the wordmark and `glyph = height` for the monogram. `src/App.css` sizes
 * the navbar around that; the arithmetic lives there.
 *
 * One measurement worth carrying: LEGAL is 14.43 units tall, so it renders at
 * `height x 14.43/121.01` — 6.7px in the 56px navbar and 8.6px in the 72px
 * footer. It is also right-aligned under the K and M rather than centred under
 * the whole mark. Both are how the artwork is drawn, and neither is this
 * component's to correct.
 *
 * The favicon does not use either file. A favicon document gets neither the
 * stylesheet nor a second chance at legibility, and three interlocked glyphs
 * close into a single dot at 16px — `public/favicon.svg` is drawn geometry for
 * that reason.
 */

/* The two fills the artwork bakes in, and the tokens that replace them. The K
   is the single #BCE8FF path; the V, M and LEGAL row are #FFFFFF. */
const DRAWN_ACCENT = 'fill="#BCE8FF"';
const DRAWN_INK = 'fill="#FFFFFF"';

interface Artwork {
  viewBox: string;
  /** Everything between <svg> and </svg>, with the two fills tokenised. */
  inner: string;
}

/**
 * Swap the artwork's two baked fills for theme tokens. Runs once per file at
 * module load, not per render.
 *
 * The `<defs>` block is passed through verbatim. Its rects and paths are also
 * pure white and black, but there they are MASK LUMINANCE, not colour — white
 * keeps a pixel, black cuts it. Tokenising those would turn the interlock cut
 * into whatever the palette happened to be and dissolve the letterforms.
 */
function themed(raw: string, expectedInk: number): Artwork {
  const shell = /<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/.exec(raw);
  if (!shell) throw new Error('VkmLogo: artwork has no <svg viewBox> shell');

  const [, viewBox, body] = shell;
  const defsEnd = body.lastIndexOf('</defs>');
  const defs = defsEnd === -1 ? '' : body.slice(0, defsEnd + '</defs>'.length);
  const drawing = defsEnd === -1 ? body : body.slice(defsEnd + '</defs>'.length);

  // Assert before substituting: a redrawn file that no longer matches must fail
  // loudly here rather than render in the wrong colours.
  const accentCount = drawing.split(DRAWN_ACCENT).length - 1;
  const inkCount = drawing.split(DRAWN_INK).length - 1;
  if (accentCount !== 1 || inkCount !== expectedInk) {
    throw new Error(
      `VkmLogo: artwork fills changed — expected 1 ${DRAWN_ACCENT} and ${expectedInk} ` +
        `${DRAWN_INK} outside <defs>, found ${accentCount} and ${inkCount}. ` +
        'Update DRAWN_ACCENT / DRAWN_INK to match the new drawing.',
    );
  }

  const inner =
    defs +
    drawing
      .split(DRAWN_ACCENT)
      .join('fill="var(--brand-mark-accent)"')
      .split(DRAWN_INK)
      .join('fill="var(--brand-mark-ink)"');

  return { viewBox, inner };
}

const ARTWORK: Record<VkmLogoVariant, Artwork> = {
  wordmark: themed(legalRaw, 7),
  monogram: themed(monogramRaw, 2),
};

/**
 * Make this instance's mask ids unique.
 *
 * Both drawings define masks and reference them by id, and the navbar and the
 * footer render a mark on the same page — duplicate ids in one document are
 * invalid and the browser resolves every `url(#id)` to whichever came first.
 * That was harmless while each drawing lived in its own <img> document and is
 * not any more.
 */
function namespaceIds(inner: string, uid: string): string {
  return inner
    .replace(/id="([^"]+)"/g, (_m, id: string) => `id="${id}-${uid}"`)
    .replace(/url\(#([^)]+)\)/g, (_m, id: string) => `url(#${id}-${uid})`);
}

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

/** The firm name is the only thing ever passed here, but a <title> is markup. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function VkmLogo({ className, title, variant }: VkmLogoProps) {
  const inherited = useContext(VariantContext);
  const art = ARTWORK[variant ?? inherited];

  // `useId` returns something like ":r3:", and a colon is not valid in the
  // fragment part of url(#...) without escaping. Strip to a safe alphabet.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const markup = useMemo(
    () => (title ? `<title>${escapeXml(title)}</title>` : '') + namespaceIds(art.inner, uid),
    [art, title, uid],
  );

  return (
    <svg
      className={className}
      viewBox={art.viewBox}
      xmlns="http://www.w3.org/2000/svg"
      /* Named when the caller gives a name, and removed from the tree when it
         does not — the navbar anchor carries its own aria-label, and naming the
         mark as well would announce the firm twice. Matches the `alt={title ??
         ''}` this replaced. */
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
