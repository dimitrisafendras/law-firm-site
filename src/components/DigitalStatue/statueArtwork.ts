/**
 * Which statue the hero draws, per palette.
 *
 * ── Why there are two ────────────────────────────────────────────────────────
 *
 * The hero is a photograph of a marble figure whose dissolving half is a
 * wireframe, and everything the scene paints — the rain, the sparkles, the fire
 * in the scale pans — is keyed to that wireframe's colour rather than to the
 * theme. `sceneColors.ts` explains why at length; the short version is that a
 * canvas layer which follows the palette while the photograph underneath it
 * cannot is not themed, it is mismatched.
 *
 * That left the nine warm and green palettes wearing a cyan statue. The fix is
 * not to re-tint the fire — it is a second artwork whose wireframe is warm gold,
 * so that on those palettes the whole composition agrees again.
 *
 * ── The two artworks are interchangeable by construction ─────────────────────
 *
 * Same render, same framing, same widths, same quality ladder. Their alpha
 * bounding boxes were compared before this shipped and agree to four decimal
 * places (L 0.1766 / R 0.9997 / T 0.0496 / B 0.9998 against the cyan's 0.1764 /
 * 0.9993 / 0.0496 / 0.9995), which is what makes the swap safe: the flame and
 * sparkle canvases are positioned against the scale pans and the body, and a
 * figure sitting even slightly differently inside its frame would put the fire
 * beside the pan instead of in it.
 *
 * ── Keyed by family, not by palette id ───────────────────────────────────────
 *
 * A scheme's light and dark halves are one design and always take the same
 * artwork, so the map is over `Palette.family`. It also means a new palette
 * added to an existing family is covered the day it lands, and a new family
 * falls back to the cyan statue rather than to nothing.
 */

import { DEFAULT_PALETTE_ID, paletteById, type Palette } from '@/theme';
import { LIMESTONE_COLORS, STATUE_COLORS, type SceneColors } from './sceneColors.ts';

import statue700Avif from '@/assets/images/hero-statue-700.avif';
import statue1050Avif from '@/assets/images/hero-statue-1050.avif';
import statue1400Avif from '@/assets/images/hero-statue-1400.avif';
import statue700Webp from '@/assets/images/hero-statue-700.webp';
import statue1050Webp from '@/assets/images/hero-statue-1050.webp';
import statue1400Webp from '@/assets/images/hero-statue-1400.webp';

import lime700Avif from '@/assets/images/hero-statue-limestone-700.avif';
import lime1050Avif from '@/assets/images/hero-statue-limestone-1050.avif';
import lime1400Avif from '@/assets/images/hero-statue-limestone-1400.avif';
import lime700Webp from '@/assets/images/hero-statue-limestone-700.webp';
import lime1050Webp from '@/assets/images/hero-statue-limestone-1050.webp';
import lime1400Webp from '@/assets/images/hero-statue-limestone-1400.webp';

export interface StatueArtwork {
  /** For debugging and for the design-system page's label. */
  id: 'cyan' | 'limestone';
  avifSrcSet: string;
  webpSrcSet: string;
  /** The `src` fallback for browsers that take neither `<source>`. */
  fallback: string;
  /** What the rain, sparkles and cool flame are painted in. */
  colors: SceneColors;
}

const CYAN: StatueArtwork = {
  id: 'cyan',
  avifSrcSet: `${statue700Avif} 700w, ${statue1050Avif} 1050w, ${statue1400Avif} 1400w`,
  webpSrcSet: `${statue700Webp} 700w, ${statue1050Webp} 1050w, ${statue1400Webp} 1400w`,
  fallback: statue1400Webp,
  colors: STATUE_COLORS,
};

const LIMESTONE: StatueArtwork = {
  id: 'limestone',
  avifSrcSet: `${lime700Avif} 700w, ${lime1050Avif} 1050w, ${lime1400Avif} 1400w`,
  webpSrcSet: `${lime700Webp} 700w, ${lime1050Webp} 1050w, ${lime1400Webp} 1400w`,
  fallback: lime1400Webp,
  colors: LIMESTONE_COLORS,
};

/**
 * The families whose accent is warm or green, and which therefore read wrong
 * beside a cyan wireframe. Everything absent from this list — Ultramarine,
 * Amethyst, Graphite — keeps the cyan statue.
 */
const LIMESTONE_FAMILIES = new Set([
  'Limestone', // marble / basalt      — gold #D9BE73 / amber #FFC98A
  'Terracotta', // papyrus / umber      — #E0A882 / #E3A882
  'Patina', // harbour / verdigris  — #7FC5D8 / #7FD8C4
  'Verdant', // celadon / serpentine — #A8CBA0 / #B6D49A
  'Olive', // peridot / olivine    — #C7C888 / #D2CE84
]);

export function artworkFor(palette: Palette): StatueArtwork {
  return LIMESTONE_FAMILIES.has(palette.family) ? LIMESTONE : CYAN;
}

/**
 * The artwork baked into the prerendered HTML.
 *
 * `scripts/prerender.mjs` renders one document for every reader, and
 * ThemeProvider resolves to `DEFAULT_PALETTE_ID` when there is no `window` — so
 * whatever that palette's artwork is, it is the one in the shipped markup. The
 * hero renders THIS on its first client pass, whatever the reader's palette,
 * and swaps in a layout effect; see the note in DigitalStatue.tsx.
 *
 * Derived rather than written down as `CYAN`, so that changing the default
 * palette to a warm one cannot silently put the wrong artwork here.
 */
export const PRERENDERED_ARTWORK: StatueArtwork = artworkFor(paletteById(DEFAULT_PALETTE_ID));
