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
 * ── The IMAGE is not chosen here; the stylesheet chooses it ──────────────────
 *
 * This module decides only what the canvas layers are painted in. Which file
 * the hero shows is a `background-image` swapped by `[data-theme]`, emitted per
 * palette by scripts/generate-theme-css.mjs from the same
 * `LIMESTONE_STATUE_FAMILIES` list this reads.
 *
 * That split is deliberate and was arrived at the hard way. Choosing the image
 * in React puts a palette-dependent `srcSet` in the tree, and ThemeProvider's
 * invariant is that nothing about the palette does — the prerendered HTML has
 * to be palette-agnostic. React 19 resolves the resulting hydration mismatch by
 * keeping the SERVER's `src`, silently: the built page showed a cyan statue
 * under `data-theme="olivine"` with no warning of any kind. Working around it
 * meant rendering the prerendered artwork first and swapping after hydration,
 * which made ten of the eighteen palettes fetch an image they never displayed.
 *
 * In CSS none of that exists. The palette is an attribute on <html> before the
 * first paint, exactly one of the two images is ever requested, and there is no
 * React state involved at all.
 *
 * The scene colours can stay here because they are read inside an effect, after
 * mount — they never appear in rendered markup, so they cannot mismatch.
 *
 * ── Keyed by family, not by palette id ───────────────────────────────────────
 *
 * A scheme's light and dark halves are one design and always take the same
 * artwork, so the map is over `Palette.family`. It also means a new palette
 * added to an existing family is covered the day it lands, and a new family
 * falls back to the cyan statue rather than to nothing.
 */

import { LIMESTONE_STATUE_FAMILIES, type Palette } from '@/theme';
import { LIMESTONE_COLORS, STATUE_COLORS, type SceneColors } from './sceneColors.ts';

export interface StatueArtwork {
  /** Which drawing is on screen. Only used to key the canvases. */
  id: 'cyan' | 'limestone';
  /** What the rain, sparkles and cool flame are painted in. */
  colors: SceneColors;
}

const CYAN: StatueArtwork = { id: 'cyan', colors: STATUE_COLORS };
const LIMESTONE: StatueArtwork = { id: 'limestone', colors: LIMESTONE_COLORS };

const FAMILIES = new Set(LIMESTONE_STATUE_FAMILIES);

export function artworkFor(palette: Palette): StatueArtwork {
  return FAMILIES.has(palette.family) ? LIMESTONE : CYAN;
}

