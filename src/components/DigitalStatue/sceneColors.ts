/**
 * The statue scene's colours. Fixed to the ARTWORK, not to the palette.
 *
 * There are two artworks now — see `statueArtwork.ts` for which palettes get
 * which — and a `SceneColors` set per artwork. That is not a widening of the
 * rule below; it is the rule. The scene has always followed the photograph, and
 * a second photograph simply means a second set of numbers to follow.
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
 * cannot is not "themed", it is mismatched. The fix for Olivine was never to
 * re-tint the fire — it is to hand Olivine a statue the fire already matches.
 *
 * So the scene is anchored to the artwork. Change the statue image and these
 * change with it; change the palette and they do not — except insofar as the
 * palette chooses the image, which is the one thing that does now vary. Nothing
 * here reads the DOM: the workers need plain triples regardless, and the values
 * are picked per artwork at mount rather than watched.
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

/** The cyan artwork — `hero-statue-*`. */
export const STATUE_COLORS: SceneColors = {
  accent: '188,232,255',
  secondary: '137,207,240',
  accentBright: '220,245,255',
};

/**
 * The limestone artwork — `hero-statue-limestone-*`, whose dissolving half is a
 * warm gold wireframe rather than a cyan one.
 *
 * Derived from the file, not invented: sampled over the left (dissolving) half
 * of `hero-statue-limestone-1400.webp`, the wireframe's median hue is 34.5deg
 * at 35% saturation. The three values below take that hue and hold the cyan
 * set's lightness profile exactly (80/66/92 against its 87/74/93), because the
 * lightness is what makes the rain read as glowing rather than as drawn — get
 * it wrong and the scene either burns out on the light palettes or vanishes on
 * the dark ones. Saturation is lifted above the artwork's own 35%: at the
 * measured value the rain came out cream and read as white, not as gold.
 */
export const LIMESTONE_COLORS: SceneColors = {
  accent: '244,212,164',
  secondary: '222,174,115',
  accentBright: '253,241,217',
};

/**
 * The two neutral artworks - `hero-statue-white-*` and `hero-statue-mono-*` -
 * share one set, and that is the limestone rule applied rather than skipped.
 *
 * That rule fixes the LIGHTNESS profile, not the artwork's own colour: the
 * cyan triple sits at HSL lightness 87 / 74 / 93 and the limestone one holds
 * that profile in a different hue because lightness is what makes the rain
 * read as glowing. A neutral wireframe has no hue to hold, so the profile at
 * zero saturation is the whole derivation - 87% of 255 is 222, 74% is 189,
 * 93% is 237.
 *
 * It is one constant and not two because the profile does not depend on how
 * dark the statue's own wireframe came out: the white artwork's mesh measures
 * a median of 190 and the mono's 136, and giving each "its own" grey would
 * have made the mono scene dim exactly where the limestone note says the
 * scene must not - vanishing on the dark palettes.
 */
export const NEUTRAL_COLORS: SceneColors = {
  accent: '222,222,222',
  secondary: '189,189,189',
  accentBright: '237,237,237',
};

/**
 * The ultramarine artwork - `hero-statue-ultramarine-*`, the cyan mesh turned
 * to the Ultramarine family's blue.
 *
 * The limestone rule again, with nothing to choose: the artwork's hue is the
 * family accent's, 215.3deg (porcelain, #A8C4EC), and the cyan set's HSL
 * saturation AND lightness are held exactly - 100/87, 77/74, 100/93 - so this
 * is the cyan triple re-hued and no more. It is deliberately not the palette's
 * own accent tokens: `lapis`'s accent is white plates, and the rain has to be
 * the wireframe's colour, not the buttons'.
 */
export const ULTRAMARINE_COLORS: SceneColors = {
  accent: '188,216,255',
  secondary: '137,179,240',
  accentBright: '220,234,255',
};
