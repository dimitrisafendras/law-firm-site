// Explicit extensions: this module is imported by scripts/generate-theme-css.mjs,
// which runs in bare node with type stripping and does not resolve them.
import { makePalette, paletteById } from './palettes.ts';
import type { Palette, PaletteSeed } from './palettes.ts';

/**
 * The light-to-dark ladder.
 *
 * Each of the nine families has a light palette and a dark one. This fills the
 * space between them with intermediate palettes so a reader can take the theme
 * down in steps rather than flipping it.
 *
 * ── Why the middle is empty, and always will be ──────────────────────────────
 *
 * The obvious implementation — interpolate the light palette into the dark one
 * — does not work, and it is worth recording how badly, because the failure is
 * silent: every colour keeps looking like a colour, and only the TEXT stops
 * being readable. Measured across all nine families:
 *
 *   blend the finished palettes ................. 1.00:1  (invisible text)
 *   snap the foregrounds at the best flip ....... 1.87:1
 *   ... and fade accent text towards body text .. 2.80:1
 *   ... and push it all the way to black/white .. 3.99:1
 *   derive every step from a blended seed ....... 1.89:1
 *
 * The cause is `accentText`. It is a saturated mid-tone picked per palette, and
 * against a ground of middling luminance the arithmetic simply runs out: 4.5:1
 * over a ground at L = 0.21 needs a foreground at L = 0.008, which is black
 * with the hue gone. `text` survives the middle because it is already
 * near-black or near-white. A brand colour cannot be.
 *
 * So there is no ladder rung in the middle. The light side walks DOWN from the
 * light palette and the dark side walks UP from the dark one, and between the
 * innermost two there is one honest step that no amount of interpolation
 * removes.
 *
 * ── Why each side darkens towards its own ink ────────────────────────────────
 *
 * An intermediate is not a blend of the two endpoints. Blending moves `ground`
 * and the ramp towards the OTHER scheme's values, and since `heroDeep` is
 * derived from `rampBottom`, the hero plunges to near-black while the page is
 * still light — which is what put `accentText/hero-deep` at the bottom of every
 * table above.
 *
 * Instead a light step darkens the light seed towards its OWN ink, and a dark
 * step lightens the dark seed towards its own. The family's hue is preserved,
 * the ramp keeps its relationship to the ground because it moves with it, and
 * `makePalette` then derives `surface`, `heroDeep`, the borders and the glass
 * exactly as it does for a shipped palette. An intermediate is a real palette,
 * not a snapshot of a crossfade.
 *
 * `continuum.test.ts` holds every stop to 4.5:1 on the grounds that carry text.
 */

/** Steps per side, counting the shipped palette as step 0. */
export const CONTINUUM_STEPS = 3;

/** Every rung, dark end first — the order the slider runs in. */
export const CONTINUUM_LENGTH = CONTINUUM_STEPS * 2;

/**
 * Where each rung's ground should land, as relative luminance.
 *
 * A TARGET rather than a mix amount, because the shipped grounds do not start
 * from the same place — Sanctuary sits at L = 0.913 and Limestone at 0.881, and
 * the dark ends range over 0.006 to 0.010. A fixed mix amount therefore spaces
 * the nine families differently, and on the dark end it barely moves at all:
 * mixing Obsidian's ground 11% towards its ink lifts it from 0.006 to 0.023,
 * which is three rungs the eye reads as one.
 *
 * Index 0 is the shipped palette and is never computed — `continuumStop`
 * returns the original object untouched.
 *
 * The innermost pair, 0.10 and 0.35, is where the ladder stops on each side.
 * Below 0.35 a light palette's brand text has to go under L = 0.039 to hold
 * 4.5:1 and stops reading as a colour; above 0.10 a dark palette's has to go
 * over L = 0.625 and washes out the same way. The distance between them is the
 * gap the measurements at the top of this file say cannot be filled.
 */
const LIGHT_TARGETS = [null, 0.6, 0.35] as const;
const DARK_TARGETS = [null, 0.035, 0.1] as const;

/**
 * Mixing a ground towards its own ink is monotone in luminance — ink is darker
 * than the ground on a light palette and lighter on a dark one — so the amount
 * that hits a target can be bisected for.
 *
 * Capped well short of 1: at 1 the ground IS the ink, and a palette whose page
 * and body text are the same colour is not a rung, it is a blank screen. The
 * cap is never reached by the targets above; it is here so that a future target
 * someone adds cannot quietly produce one.
 */
const MAX_TRAVEL = 0.8;

function mixToLuminance(from: string, toward: string, target: number): number {
  const rising = relativeLuminance(toward) > relativeLuminance(from);
  let lo = 0;
  let hi = MAX_TRAVEL;
  for (let i = 0; i < 24; i++) {
    const midpoint = (lo + hi) / 2;
    const reached = relativeLuminance(mix(from, toward, midpoint));
    if (rising ? reached < target : reached > target) lo = midpoint;
    else hi = midpoint;
  }
  return hi;
}

type Rgb = [number, number, number];

function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function rgbToHex([r, g, b]: Rgb): string {
  const to = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

/** Plain sRGB channel mix, the same one `palettes.ts` derives everything with.
 *  Deliberately not gamma-correct: these values feed `makePalette`, which is
 *  built around this mix, and a second interpolation model inside the same
 *  derivation would put the intermediates on a different curve to the
 *  endpoints. */
function mix(a: string, b: string, t: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex([
    A[0] + (B[0] - A[0]) * t,
    A[1] + (B[1] - A[1]) * t,
    A[2] + (B[2] - A[2]) * t,
  ]);
}

const WHITE = '#FFFFFF';
const BLACK = '#000000';

function channelLuminance(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b)
  );
}

/** WCAG 2.x contrast ratio between two opaque colours. */
export function contrastRatio(a: string, b: string): number {
  const x = relativeLuminance(a);
  const y = relativeLuminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const TEXT_TARGET = 4.5;

/**
 * Recover a seed from a finished palette.
 *
 * Every seed field is present in the tokens it produced, so this works for the
 * two hand-tuned palettes (Sanctuary and Obsidian) as well as the sixteen
 * generated ones, and no seed table has to be exported or duplicated. The ramp
 * ends are exact: `makeColors` sets `gradStop1` to `rampTop` and `gradStop6` to
 * `rampBottom` by construction.
 *
 * `tintRgb` is read back out of the glass fill rather than guessed. A hand-tuned
 * palette's glass is not a pure function of its tint, so for those two the
 * recovered tint reproduces the intermediates' glass, not their own — which is
 * all it is used for.
 */
function seedOf(palette: Palette): PaletteSeed {
  const { colors, glass } = palette;
  const tint = /rgba?\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)/.exec(glass.bg);
  return {
    label: palette.label,
    scheme: palette.scheme,
    ink: colors.text,
    ground: colors.background,
    rampTop: colors.gradStop1,
    rampBottom: colors.gradStop6,
    accent: colors.accent,
    accentText: colors.accentText,
    accentContainer: colors.accentContainer,
    secondary: colors.secondary,
    tertiary: colors.tertiary,
    error: colors.error,
    onAccent: colors.onAccent,
    tintRgb: tint ? `${tint[1]}, ${tint[2]}, ${tint[3]}` : '255, 255, 255',
  };
}

/**
 * Pull a brand colour far enough from a ground to stay readable, and no
 * further.
 *
 * The pole is black on a light scheme and white on a dark one — the direction
 * the text is already going. Returning the colour untouched whenever it already
 * passes is the point: at the shipped endpoints nothing is shaded at all, and
 * the further down the ladder a reader goes the more of the brand colour is
 * traded for legibility, which is the honest order to lose it in.
 */
function shadeToContrast(colour: string, grounds: string[], pole: string): string {
  const worst = () => Math.min(...grounds.map((g) => contrastRatio(colour, g)));
  if (worst() >= TEXT_TARGET) return colour;

  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 20; i++) {
    const midpoint = (lo + hi) / 2;
    const candidate = mix(colour, pole, midpoint);
    const ok = grounds.every((g) => contrastRatio(candidate, g) >= TEXT_TARGET);
    if (ok) hi = midpoint;
    else lo = midpoint;
  }
  return mix(colour, pole, hi);
}

/**
 * One rung of a family's ladder.
 *
 * `step` counts away from the shipped palette: 0 IS the shipped palette,
 * returned untouched so that nothing about the default rendering changes.
 */
export function continuumStop(endpoint: Palette, step: number): Palette {
  const index = Math.max(0, Math.min(CONTINUUM_STEPS - 1, Math.round(step)));
  if (index === 0) return endpoint;

  const dark = endpoint.scheme === 'dark';
  const target = (dark ? DARK_TARGETS : LIGHT_TARGETS)[index];
  const base = seedOf(endpoint);
  if (target === null) return endpoint;

  // The ground and both ramp ends travel together, towards the palette's own
  // ink, by the amount that lands the GROUND on the target. Moving all three by
  // that same amount is what keeps `heroDeep` — derived from `rampBottom` — in
  // step with the page instead of racing ahead of it, which is the failure that
  // sank every blend in the table above.
  const toward = base.ink;
  const travel = mixToLuminance(base.ground, toward, target);
  const moved: PaletteSeed = {
    ...base,
    ground: mix(base.ground, toward, travel),
    rampTop: mix(base.rampTop, toward, travel),
    rampBottom: mix(base.rampBottom, toward, travel),
  };

  // Derive once to find out what the grounds actually became, then shade the
  // two brand colours against those real values and derive again. `heroDeep`
  // cannot be known before the first pass — it falls out of the ramp.
  const probe = makePalette(endpoint.id, endpoint.pair, endpoint.family, moved);
  const textGrounds = [probe.colors.background, probe.colors.surface, probe.colors.heroDeep];
  const pole = dark ? WHITE : BLACK;

  const seed: PaletteSeed = {
    ...moved,
    ink: shadeToContrast(moved.ink, textGrounds, pole),
    accentText: shadeToContrast(moved.accentText, textGrounds, pole),
  };

  return makePalette(endpoint.id, endpoint.pair, endpoint.family, seed);
}

/**
 * A family's whole ladder, darkest first.
 *
 * Index 0 is the dark palette as shipped and index 5 the light one, so the
 * slider's own axis — left is darker — is the array's axis and no component has
 * to reverse it.
 */
export function continuumFor(anyMember: Palette): Palette[] {
  const twin = paletteById(anyMember.pair);
  const light = anyMember.scheme === 'light' ? anyMember : twin;
  const dark = anyMember.scheme === 'light' ? twin : anyMember;

  const darkSide: Palette[] = [];
  for (let i = 0; i < CONTINUUM_STEPS; i++) darkSide.push(continuumStop(dark, i));

  const lightSide: Palette[] = [];
  for (let i = CONTINUUM_STEPS - 1; i >= 0; i--) lightSide.push(continuumStop(light, i));

  // darkSide runs outward from the dark palette, so it is already in
  // darkest-first order; lightSide was built inward-to-outward for the same
  // reason and needs no further reversing.
  return [...darkSide, ...lightSide];
}

/**
 * Where a rung sits as `data-theme` plus `data-step`.
 *
 * The attribute pair, rather than an inline style, is what keeps this on the
 * CSS side of the line the whole theme system is built on: the stylesheet
 * carries every rung, the inline script in index.html can stamp one before the
 * first paint, and nothing palette-shaped passes through the React tree.
 */
export function rungAddress(index: number): { id: 'light' | 'dark'; step: number } {
  const i = Math.max(0, Math.min(CONTINUUM_LENGTH - 1, Math.round(index)));
  // `continuumFor` builds the ladder darkest-first: the dark side runs OUTWARD
  // from the dark palette (index 0 is its step 0), and the light side runs
  // INWARD to the light palette (the last index is its step 0). The two sides
  // therefore count in opposite directions, which is the whole subtlety here.
  return i < CONTINUUM_STEPS
    ? { id: 'dark', step: i }
    : { id: 'light', step: CONTINUUM_LENGTH - 1 - i };
}
