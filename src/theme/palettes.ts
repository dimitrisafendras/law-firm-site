/**
 * The site's ten colour combinations.
 *
 * ── Why this file exists ──────────────────────────────────────────────────────
 *
 * `tokens.ts` holds 29 colour keys, 14 glass keys and 2 gradient keys. Typing
 * all 45 out ten times would be 450 hand-authored values, and the moment one
 * palette gained a key the other nine would silently keep rendering the last
 * palette's value for it — which is precisely the duplication the project's
 * token rule exists to stop.
 *
 * So a palette is declared as a *seed*: the twelve decisions that actually
 * differ between one look and another (the ink, the ground, the two ends of the
 * page ramp, and the brand roles). Everything else — surfaces, containers,
 * borders, alpha washes, the six ramp stops, the glass material and the two
 * decorative gradients — is derived from the seed by `makePalette`, so every
 * palette is internally consistent by construction and adding a key means
 * editing one function rather than ten literals.
 *
 * Obsidian and Sanctuary are the exceptions: they are the hand-tuned dark and
 * light sets already in `tokens.ts`, kept verbatim rather than regenerated. The
 * dark one in particular carries a lot of measured decisions (see the long
 * notes on `glass.dark.tint` and `colors.dark.gradStop*`) that a generic
 * derivation would flatten.
 *
 * ── Adding a palette ──────────────────────────────────────────────────────────
 *
 * Add a seed to `SEEDS` and it appears everywhere: the generated stylesheet
 * gains a `:root[data-theme='<id>']` block, the settings menu gains a swatch,
 * and the design-system page gains a row. Nothing else needs touching.
 */

import { colors, glass, gradients, type ColorTokens, type GlassTokens, type GradientTokens } from './tokens.ts';

export type ColorScheme = 'light' | 'dark';

/* ─── Colour maths ──────────────────────────────────────────────────────────
   Small and deliberate. Everything here works in sRGB, which is wrong for
   perceptual mixing and right for this job: the seeds were picked by eye in
   sRGB, so a ramp mixed the same way lands where the eye expects it to. */

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

/** `t` of 0 returns `a`, 1 returns `b`. */
function mix(a: string, b: string, t: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex([
    A[0] + (B[0] - A[0]) * t,
    A[1] + (B[1] - A[1]) * t,
    A[2] + (B[2] - A[2]) * t,
  ]);
}

function alpha(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const WHITE = '#FFFFFF';
const BLACK = '#000000';

/* ─── Seeds ─────────────────────────────────────────────────────────────────
   The twelve values that make a palette a palette. Everything a stylesheet can
   ask for is derived from these. */

export interface PaletteSeed {
  /** Display name in the settings menu. Not translated — these are proper nouns. */
  label: string;
  scheme: ColorScheme;
  /** Body text, and the colour every border and wash is tinted from. */
  ink: string;
  /** The page floor. `--bg`. */
  ground: string;
  /** First and last stop of the six-step page ramp, lightest to darkest. */
  rampTop: string;
  rampBottom: string;
  /** The brand fill — buttons, chips, the bright end of the accent family. */
  accent: string;
  /** The brand colour that is legible *as text* on `ground`. Often ≠ accent. */
  accentText: string;
  /** A calmer accent fill for large areas. */
  accentContainer: string;
  secondary: string;
  tertiary: string;
  error: string;
  /** Text on top of `accent`. */
  onAccent: string;
  /** Glass tint, as an "r, g, b" triple. Dark palettes want this LIGHTER than
      the ground — glass over a dark ground catches light. */
  tintRgb: string;
}

const SEEDS: Record<string, PaletteSeed> = {
  basalt: {
    label: 'Basalt',
    scheme: 'dark',
    ink: '#EAE6DF',
    ground: '#15140F',
    rampTop: '#2A2721',
    rampBottom: '#131210',
    accent: '#FFC98A',
    accentText: '#FFC98A',
    accentContainer: '#FFB775',
    secondary: '#FFB775',
    tertiary: '#89CFF0',
    error: '#FC8181',
    onAccent: '#15140F',
    tintRgb: '122, 108, 84',
  },
  verdigris: {
    label: 'Verdigris',
    scheme: 'dark',
    ink: '#DDE8E4',
    ground: '#0C1614',
    rampTop: '#16302B',
    rampBottom: '#0A1412',
    accent: '#7FD8C4',
    accentText: '#7FD8C4',
    accentContainer: '#4FB8A0',
    secondary: '#4FB8A0',
    tertiary: '#E8A87C',
    error: '#FC8181',
    onAccent: '#08110F',
    tintRgb: '58, 110, 100',
  },
  porphyry: {
    label: 'Porphyry',
    scheme: 'dark',
    ink: '#EDE2E8',
    ground: '#150F16',
    rampTop: '#2C1E30',
    rampBottom: '#120D14',
    accent: '#E8A9C4',
    accentText: '#E8A9C4',
    accentContainer: '#C77BA0',
    secondary: '#C77BA0',
    tertiary: '#F0C674',
    error: '#FC8181',
    onAccent: '#150F16',
    tintRgb: '110, 78, 116',
  },
  /* Monochrome on purpose: the accent family is grey, so the only colour on the
     page is whatever a photograph brings. Gold is held back as `tertiary` for
     the one or two places that need a spark. */
  ink: {
    label: 'Ink',
    scheme: 'dark',
    ink: '#E6E6E6',
    ground: '#0B0B0C',
    rampTop: '#1E1E20',
    rampBottom: '#0A0A0B',
    accent: '#D8D8DC',
    accentText: '#C8C8CE',
    accentContainer: '#A8A8B0',
    secondary: '#9A9AA2',
    tertiary: '#C9A227',
    error: '#FC8181',
    onAccent: '#0B0B0C',
    tintRgb: '96, 96, 104',
  },
  marble: {
    label: 'Marble',
    scheme: 'light',
    ink: '#2B2A26',
    ground: '#F4F1EA',
    rampTop: '#FBF9F4',
    rampBottom: '#ECE7DC',
    accent: '#D9BE73',
    accentText: '#7A5C18',
    accentContainer: '#EFE2BC',
    secondary: '#3E4A57',
    tertiary: '#4E7FA8',
    error: '#B02A2A',
    onAccent: '#2B2A26',
    tintRgb: '255, 255, 255',
  },
  harbour: {
    label: 'Harbour',
    scheme: 'light',
    ink: '#16242B',
    ground: '#EEF3F5',
    rampTop: '#FAFCFD',
    rampBottom: '#E4EBEF',
    accent: '#7FC5D8',
    accentText: '#175A6B',
    accentContainer: '#C7E6EE',
    secondary: '#0F3F4C',
    tertiary: '#E8A87C',
    error: '#B02A2A',
    onAccent: '#0B2027',
    tintRgb: '255, 255, 255',
  },
  papyrus: {
    label: 'Papyrus',
    scheme: 'light',
    ink: '#2E241C',
    ground: '#F6F1E8',
    rampTop: '#FCF9F3',
    rampBottom: '#EDE5D8',
    accent: '#E0A882',
    accentText: '#8A4A2A',
    accentContainer: '#F3D9C6',
    secondary: '#5C3A28',
    tertiary: '#6E8B6B',
    error: '#B02A2A',
    onAccent: '#2E241C',
    tintRgb: '255, 255, 255',
  },
  slate: {
    label: 'Slate',
    scheme: 'light',
    ink: '#1C2028',
    ground: '#F1F2F5',
    rampTop: '#FBFBFD',
    rampBottom: '#E7E9EE',
    accent: '#A5B4E8',
    accentText: '#3B4A8C',
    accentContainer: '#D8DEF6',
    secondary: '#2A3566',
    tertiary: '#E8A87C',
    error: '#B02A2A',
    onAccent: '#171B22',
    tintRgb: '255, 255, 255',
  },
};

/* ─── Derivation ────────────────────────────────────────────────────────────
   The mixing partner flips with the scheme: a dark palette builds its surfaces
   by lifting the ground toward white, a light one by darkening it toward the
   ink. Using `ink` rather than black on the light side keeps a warm palette
   warm all the way down — mixing toward pure black would grey it out. */

function makeColors(seed: PaletteSeed): ColorTokens {
  const dark = seed.scheme === 'dark';
  const lift = (t: number) => (dark ? mix(seed.ground, WHITE, t) : mix(seed.ground, seed.ink, t));

  /* Six stops, lightest to darkest, consumed in page order (PracticeGrid takes
     stop 1, ContactSection takes stop 6) so the page settles as it scrolls. */
  const stop = (i: number) => mix(seed.rampTop, seed.rampBottom, i / 5);

  return {
    text: seed.ink,
    textHeading: seed.ink,
    background: seed.ground,
    surface: dark ? lift(0.04) : mix(seed.ground, WHITE, 0.6),
    gradStop1: stop(0),
    gradStop2: stop(1),
    gradStop3: stop(2),
    gradStop4: stop(3),
    gradStop5: stop(4),
    gradStop6: stop(5),
    /* The hero's two deep stops. Both sit below the ramp's floor so the hero
       reads as the darkest thing on a dark page and the deepest thing on a
       light one, and `heroDeepest` is the *lighter* of the pair — it is the
       lit end of the hero's own gradient, not the page's. */
    heroDeep: dark ? mix(seed.rampBottom, seed.rampTop, 0.2) : mix(seed.rampBottom, seed.ink, 0.08),
    heroDeepest: dark ? mix(seed.rampBottom, seed.rampTop, 0.45) : mix(seed.rampBottom, seed.ink, 0.16),
    border: alpha(seed.ink, 0.15),
    codeBg: lift(0.05),
    accent: seed.accent,
    accentText: seed.accentText,
    accentBg: alpha(seed.accent, dark ? 0.1 : 0.18),
    accentBorder: alpha(seed.accent, dark ? 0.3 : 0.5),
    accentContainer: seed.accentContainer,
    secondary: seed.secondary,
    tertiary: seed.tertiary,
    error: seed.error,
    onAccent: seed.onAccent,
    socialBg: alpha(lift(0.05), 0.5),
    surfaceContainerLow: lift(0.05),
    surfaceContainerHigh: lift(0.11),
    surfaceVariant: dark ? alpha(lift(0.16), 0.6) : alpha(WHITE, 0.6),
    outline: alpha(seed.ink, 0.15),
    shadow: dark
      ? `${alpha(seed.ink, 0.04)} 0 0 40px`
      : `${alpha(seed.ink, 0.07)} 0 10px 15px -3px, ${alpha(seed.ink, 0.04)} 0 4px 6px -2px`,
  };
}

function makeGlass(seed: PaletteSeed, palette: ColorTokens): GlassTokens {
  const dark = seed.scheme === 'dark';
  const tint = (a: number) => `rgba(${seed.tintRgb}, ${a})`;

  return dark
    ? {
        bg: tint(0.38),
        bgStrong: tint(0.54),
        border: alpha(WHITE, 0.24),
        shadow: '0 10px 30px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.3)',
        blur: '20px',
        blurStrong: '28px',
        saturate: '180%',
        tint: tint(0.38),
        tintClear: tint(0.2),
        highlight: alpha(WHITE, 0.5),
        edge: alpha(WHITE, 0.24),
        /* 1.4.11 asks a control's boundary to clear 3:1; `edge` at 0.24 does
           not, so anything held to that bar takes this instead. */
        controlEdge: alpha(WHITE, 0.38),
        glow: alpha(seed.accent, 0.24),
        highlightClear: alpha(WHITE, 0.18),
        edgeClear: alpha(WHITE, 0.1),
        glowClear: alpha(seed.accent, 0.1),
        /* The ramp's own floor, so a matte card is the page's floor rather than
           an invented fourth dark grey. */
        matte: palette.gradStop6,
      }
    : {
        bg: tint(0.55),
        bgStrong: tint(0.65),
        border: alpha(WHITE, 0.5),
        shadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
        blur: '20px',
        blurStrong: '28px',
        saturate: '180%',
        tint: tint(0.55),
        tintClear: tint(0.24),
        highlight: alpha(WHITE, 0.7),
        edge: alpha(WHITE, 0.5),
        controlEdge: alpha(BLACK, 0.42),
        glow: alpha(WHITE, 0.45),
        highlightClear: alpha(WHITE, 0.35),
        edgeClear: alpha(WHITE, 0.22),
        glowClear: alpha(WHITE, 0.2),
        matte: palette.gradStop6,
      };
}

function makeGradients(seed: PaletteSeed): GradientTokens {
  const dark = seed.scheme === 'dark';
  /* Decorative only — the two "glass card" washes. On a dark palette the brand
     colours are pale, so they are dragged most of the way to the ground before
     they go into a gradient; on a light one they are used as they are. */
  const deep = (c: string) => (dark ? mix(c, seed.ground, 0.68) : c);

  return {
    glassA: `linear-gradient(135deg, ${deep(seed.accent)} 0%, ${deep(seed.secondary)} 100%)`,
    glassB: `linear-gradient(160deg, ${deep(seed.secondary)} 0%, ${deep(seed.accent)} 50%, ${deep(seed.tertiary)} 100%)`,
  };
}

export interface Palette {
  id: string;
  label: string;
  scheme: ColorScheme;
  colors: ColorTokens;
  glass: GlassTokens;
  gradients: GradientTokens;
}

function makePalette(id: string, seed: PaletteSeed): Palette {
  const paletteColors = makeColors(seed);
  return {
    id,
    label: seed.label,
    scheme: seed.scheme,
    colors: paletteColors,
    glass: makeGlass(seed, paletteColors),
    gradients: makeGradients(seed),
  };
}

/**
 * All ten, in menu order: the two hand-tuned originals first, then the derived
 * eight interleaved dark/light so the picker never shows five of one kind in a
 * row.
 *
 * `obsidian` is the default and the one every existing stylesheet was measured
 * against. It and `sanctuary` are taken verbatim from `tokens.ts` rather than
 * regenerated — see the file header.
 */
export const palettes: Palette[] = [
  {
    id: 'obsidian',
    label: 'Obsidian',
    scheme: 'dark',
    colors: colors.dark,
    glass: glass.dark,
    gradients: gradients.dark,
  },
  {
    id: 'sanctuary',
    label: 'Sanctuary',
    scheme: 'light',
    colors: colors.light,
    glass: glass.light,
    gradients: gradients.light,
  },
  makePalette('basalt', SEEDS.basalt),
  makePalette('marble', SEEDS.marble),
  makePalette('verdigris', SEEDS.verdigris),
  makePalette('harbour', SEEDS.harbour),
  makePalette('porphyry', SEEDS.porphyry),
  makePalette('papyrus', SEEDS.papyrus),
  makePalette('ink', SEEDS.ink),
  makePalette('slate', SEEDS.slate),
];

/** The palette a first-time visitor gets, and the one emitted into bare `:root`. */
export const DEFAULT_PALETTE_ID = 'obsidian';

export const paletteIds: string[] = palettes.map((p) => p.id);

export function paletteById(id: string | null | undefined): Palette {
  return palettes.find((p) => p.id === id) ?? palettes[0];
}

export function isPaletteId(id: unknown): id is string {
  return typeof id === 'string' && paletteIds.includes(id);
}
