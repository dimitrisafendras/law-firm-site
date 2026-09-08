/**
 * The statue scene's colours. Fixed to the artwork, NOT to the palette.
 *
 * ── Why these do not follow the theme ────────────────────────────────────────
 *
 * Everything in this scene is painted over, into or beside one photograph:
 * `hero-statue-*.avif`, a marble figure whose dissolving half is a cyan
 * wireframe. That cyan is baked into the image file. It cannot be re-tinted,
 * and the whole composition is built to sit with it — the rain falls in it, the
 * sparkles land on it, the fire in the scale pans answers it.
 *
 * These colours briefly did follow `--accent` and `--secondary`, which was the
 * wrong call and looked it: on Olivine the fire in the scales burned khaki two
 * inches from a cyan statue, and the same on every palette that is not blue. A
 * canvas layer that tracks the palette while the photograph underneath it
 * cannot is not "themed", it is mismatched.
 *
 * So the scene is anchored to the artwork. Change the statue image and these
 * change with it; change the palette and they do not. That is also why nothing
 * here reads the DOM any more: there is no live value to read, the workers need
 * plain triples regardless, and the scene no longer has to be torn down and
 * rebuilt every time someone switches theme.
 *
 * These are the values the drawing's own wireframe is composited from.
 */

/** An "r,g,b" triple, ready to interpolate into an `rgba(…)` string. */
export type RgbTriple = string;

export interface SceneColors {
  /** The wireframe's bright edge. Rain heads and star haloes. */
  accent: RgbTriple;
  /** The step below it. Rain trails, and the cool flame's body. */
  secondary: RgbTriple;
  /** The bright edge lifted toward white — the specular pass on stars and flame. */
  accentBright: RgbTriple;
}

export const STATUE_COLORS: SceneColors = {
  accent: '188,232,255',
  secondary: '137,207,240',
  accentBright: '220,245,255',
};
