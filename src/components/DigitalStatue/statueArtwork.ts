/**
 * What the hero's canvas layers are painted in, per statue.
 *
 * ── The registry, not a palette map ──────────────────────────────────────────
 *
 * `src/theme/statues.ts` owns WHICH statue is on screen: a reader's pin if there
 * is one, else the palette family's artwork. This file owns only what the rain,
 * the sparkles and the cool flame are painted in once that has been decided,
 * and it is keyed on the resolved statue id so that both of those inputs are
 * already accounted for. It used to key on the palette family itself, which
 * could not express a reader's pin.
 *
 * ── Why the scene follows the drawing and not the theme ──────────────────────
 *
 * The hero is a photograph of a marble figure whose dissolving half is a
 * wireframe, and that wireframe's colour is baked into the file. Everything the
 * scene paints sits over, into or beside it — the rain falls in it, the sparkles
 * land on it, the fire in the scale pans answers it. `sceneColors.ts` has the
 * full argument; the short version is that a canvas layer which tracks the
 * palette while the photograph underneath it cannot is not themed, it is
 * mismatched, and the fix for a warm palette was never to re-tint the fire but
 * to hand it a statue the fire already matches.
 *
 * So five drawings and four colour sets. `white` and `mono` share one, because
 * the neutral profile does not depend on which grey the mesh came out (see
 * NEUTRAL_COLORS).
 *
 * ── The artworks are interchangeable by construction ─────────────────────────
 *
 * Same render, same framing, same widths, same quality ladder. Their alpha
 * bounding boxes were compared before the second one shipped and agree to four
 * decimal places, which is what makes the swap safe: the flame and sparkle
 * canvases are positioned against the scale pans and the body, and a figure
 * sitting even slightly differently inside its frame would put the fire beside
 * the pan instead of in it.
 *
 * ── The IMAGE is not chosen here; the stylesheet chooses it ──────────────────
 *
 * Which file the hero shows is a `background-image` swapped on `[data-theme]`
 * and `[data-statue]`, emitted per palette and per statue by
 * scripts/generate-theme-css.mjs — which is also why the family lists live in
 * `palettes.ts` and `statues.ts` rather than here: that script runs in bare node
 * and cannot import a module that imports images.
 *
 * That split is deliberate and was arrived at the hard way. Choosing the image
 * in React puts a palette-dependent `srcSet` in the tree, and ThemeProvider's
 * invariant is that nothing about the palette does — the prerendered HTML has to
 * be palette-agnostic. React 19 resolves the resulting hydration mismatch by
 * keeping the SERVER's `src`, silently: the built page showed a cyan statue
 * under `data-theme="olivine"` with no warning of any kind. Working around it
 * meant rendering the prerendered artwork first and swapping after hydration,
 * which made most of the palettes fetch an image they never displayed.
 *
 * In CSS none of that exists. The palette and the pin are attributes on <html>
 * before the first paint, exactly one image is ever requested, and there is no
 * React state involved at all.
 *
 * The scene colours can stay here because they are read inside an effect, after
 * mount — they never appear in rendered markup, so they cannot mismatch.
 */

import { type StatueId } from '@/theme';
import {
  LIMESTONE_COLORS,
  NEUTRAL_COLORS,
  STATUE_COLORS,
  ULTRAMARINE_COLORS,
  type SceneColors,
} from './sceneColors.ts';

export interface StatueArtwork {
  /** Which drawing is on screen. Also the React key that remounts the canvases. */
  id: StatueId;
  /** What the rain, sparkles and cool flame are painted in. */
  colors: SceneColors;
}

/*
 * Module constants, one per statue, so `artworkFor` is referentially stable:
 * the value goes straight into DigitalStatue's effect dependencies, and a fresh
 * object per render would tear the whole scene down and rebuild it every time
 * anything above the hero changed.
 */
const ARTWORKS: Record<StatueId, StatueArtwork> = {
  cyan: { id: 'cyan', colors: STATUE_COLORS },
  ultramarine: { id: 'ultramarine', colors: ULTRAMARINE_COLORS },
  white: { id: 'white', colors: NEUTRAL_COLORS },
  mono: { id: 'mono', colors: NEUTRAL_COLORS },
  limestone: { id: 'limestone', colors: LIMESTONE_COLORS },
};

/** The scene for a resolved statue — see `resolveStatue` in src/theme/statues.ts. */
export function artworkFor(id: StatueId): StatueArtwork {
  return ARTWORKS[id];
}
