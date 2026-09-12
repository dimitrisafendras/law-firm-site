/**
 * The site's eighteen colour combinations — nine schemes, each light and dark.
 *
 * ── Why this file exists ──────────────────────────────────────────────────────
 *
 * `tokens.ts` holds 29 colour keys, 14 glass keys and 2 gradient keys. Typing
 * all 45 out eighteen times would be 810 hand-authored values, and the moment one
 * palette gained a key the other seventeen would silently keep rendering the last
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
  /**
   * The brand colour that is legible *as text*. Often ≠ accent.
   *
   * "Legible" is not measured against `ground` alone, which is what these
   * values were first picked against and why five of them had to be re-picked.
   * The site puts accent type on three grounds, and `ground` is the kindest of
   * them: the hero paints its copy on `heroDeep`, up to 20% darker on a light
   * palette; and a `.glass` card lit by the page ramp's accent blooms is
   * lighter than `ground` on a dark one — brightest of all on Lapis, whose
   * accent is literally white. Measured over what is actually painted rather
   * than over the token, Marble came to 4.38:1 on the hero and Lapis to 4.11:1
   * on the auth card.
   *
   * So a new seed's `accentText` has to clear 4.5:1 against all three. There
   * is no assertion for it here because the third ground cannot be computed
   * from a palette — it depends on what the blur samples — so it is measured
   * from screenshots. See CLAUDE.md.
   */
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
    accentText: '#5F4813',
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
    accentText: '#713C22',
    accentContainer: '#F3D9C6',
    secondary: '#5C3A28',
    tertiary: '#6E8B6B',
    error: '#B02A2A',
    onAccent: '#2E241C',
    tintRgb: '255, 255, 255',
  },
  /*
   * The blue-and-white pair.
   *
   * Lapis lazuli is a deep blue stone shot through with white calcite and
   * flecks of gold pyrite, and blue-and-white porcelain is its light-ground
   * twin — the same two colours with the ground and the figure swapped. They
   * are deliberately a matched set: Lapis puts white on blue, Porcelain puts
   * blue on white, and both keep the pyrite gold in `tertiary`.
   *
   * Lapis is NOT a second Obsidian. Obsidian is a desaturated navy carrying a
   * soft baby blue; this is a saturated ultramarine carrying near-white, so the
   * page reads as blue rather than as near-black with a blue cast.
   */
  lapis: {
    label: 'Lapis',
    scheme: 'dark',
    ink: '#F2F5FA',
    ground: '#0A1836',
    rampTop: '#16305E',
    rampBottom: '#081328',
    /* `accent` is the white half of blue-and-white — buttons are white plates
       with navy type. `accentText` has to be a BLUE, not that same white: it is
       what paints the wordmark's K, and a near-white K against white letters
       stops being picked out at all. It is also the focus ring, so it is the
       lightest blue that still reads as blue on this ground. */
    accent: '#FFFFFF',
    accentText: '#BCD5F8',
    accentContainer: '#D8E6FF',
    secondary: '#6F9BE0',
    tertiary: '#E8C46A',
    error: '#FC8181',
    onAccent: '#0A1836',
    tintRgb: '70, 100, 160',
  },
  porcelain: {
    label: 'Porcelain',
    scheme: 'light',
    ink: '#16233D',
    ground: '#F7F9FC',
    rampTop: '#FFFFFF',
    rampBottom: '#E9EEF6',
    accent: '#A8C4EC',
    accentText: '#1E4E8C',
    accentContainer: '#D6E3F7',
    secondary: '#12356B',
    tertiary: '#B08A2E',
    error: '#B02A2A',
    onAccent: '#16233D',
    tintRgb: '255, 255, 255',
  },
  /*
   * The green pair. Nothing in the set was green — Verdigris is oxidised
   * copper, which is a blue-green, and reads as teal beside these. Serpentine
   * is the yellow-green stone and Celadon its glazed light twin, the same
   * relationship Lapis and Porcelain have.
   */
  serpentine: {
    label: 'Serpentine',
    scheme: 'dark',
    ink: '#E8EEE2',
    ground: '#101A0E',
    rampTop: '#1E3019',
    rampBottom: '#0D160C',
    accent: '#B6D49A',
    accentText: '#B6D49A',
    accentContainer: '#8FB472',
    secondary: '#8FB472',
    tertiary: '#D9B36A',
    error: '#FC8181',
    onAccent: '#101A0E',
    tintRgb: '86, 118, 74',
  },
  celadon: {
    label: 'Celadon',
    scheme: 'light',
    ink: '#1C2A1E',
    ground: '#F0F4EC',
    rampTop: '#FAFCF7',
    rampBottom: '#E4EBDE',
    accent: '#A8CBA0',
    accentText: '#275A33',
    accentContainer: '#D4E6CE',
    secondary: '#24512F',
    tertiary: '#B08A2E',
    error: '#B02A2A',
    onAccent: '#1C2A1E',
    tintRgb: '255, 255, 255',
  },
  /*
   * The olive pair — the gem and the rock of the same mineral, which is also
   * the light and the dark of the same colour.
   *
   * Distinct from Verdant, which sits next to it in the picker precisely so the
   * two can be told apart: Serpentine and Celadon are a fresh, slightly cool
   * green, where these are drab and yellow — khaki over an olive-black ground,
   * with a tan rather than a brass spark. Put them side by side and the
   * difference is hue, not lightness.
   */
  olivine: {
    label: 'Olivine',
    scheme: 'dark',
    ink: '#EDEBDC',
    ground: '#16170D',
    rampTop: '#2C2E16',
    rampBottom: '#12130B',
    accent: '#D2CE84',
    accentText: '#D2CE84',
    accentContainer: '#A8A45C',
    secondary: '#A8A45C',
    tertiary: '#C9A87A',
    error: '#FC8181',
    onAccent: '#16170D',
    tintRgb: '104, 106, 66',
  },
  peridot: {
    label: 'Peridot',
    scheme: 'light',
    ink: '#26281A',
    ground: '#F3F3E7',
    rampTop: '#FBFBF3',
    rampBottom: '#E8E8D6',
    accent: '#C7C888',
    accentText: '#4F511A',
    accentContainer: '#E2E2BC',
    secondary: '#3E4020',
    tertiary: '#9C6B3E',
    error: '#B02A2A',
    onAccent: '#26281A',
    tintRgb: '255, 255, 255',
  },
  /*
   * Ink's light twin, and the only achromatic light palette — every other one
   * carries a tint. The accent family is grey, so the page's only colour is
   * whatever a photograph brings, and the gold sits in `tertiary` for the one
   * or two places that need a spark. Same call Ink makes, inverted.
   */
  chalk: {
    label: 'Chalk',
    scheme: 'light',
    ink: '#1A1A18',
    ground: '#F7F6F3',
    rampTop: '#FFFFFF',
    rampBottom: '#EBEAE6',
    accent: '#B9B7B0',
    accentText: '#4A4844',
    accentContainer: '#DEDCD6',
    secondary: '#383632',
    tertiary: '#8A6A1F',
    error: '#B02A2A',
    onAccent: '#1A1A18',
    tintRgb: '255, 255, 255',
  },
  /*
   * Papyrus's dark partner, and the only red in the dark set — Basalt is amber
   * on neutral charcoal, not earth. Umber is the burnt pigment: a red-brown
   * ground under the same warm clay Papyrus carries, so the two read as one
   * scheme lit from opposite ends.
   */
  umber: {
    label: 'Umber',
    scheme: 'dark',
    ink: '#F2E7E0',
    ground: '#1A100C',
    rampTop: '#38211A',
    rampBottom: '#150D0A',
    accent: '#E3A882',
    accentText: '#EBB794',
    accentContainer: '#C4805C',
    secondary: '#C4805C',
    tertiary: '#9CB894',
    /* Deliberately redder and more saturated than `accent`: on a clay palette
       an error state has to be tellable from the brand colour. */
    error: '#FF7B7B',
    onAccent: '#1A100C',
    tintRgb: '128, 88, 68',
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
    /* The wordmark. Dark palettes keep the artwork's drawn white; light ones
       take the page's own ink so a warm palette gets a warm mark. The K takes
       the readable brand step, never the fill. */
    markInk: dark ? WHITE : seed.ink,
    markAccent: seed.accentText,
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
           not, so anything held to that bar takes this instead. 0.50 rather
           than the 0.38 this started at — see tokens.ts, which carries the
           measurements: the header's controls float over the hero and 0.38
           only reached 2.41:1 there. */
        controlEdge: alpha(WHITE, 0.5),
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
        /* Black, not white: `edge` is a lit rim and vanishes on a light
           ground. 0.46 rather than 0.42 for the same reason as the dark set
           above — measured over the grounds these controls actually sit on. */
        controlEdge: alpha(BLACK, 0.46),
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
  /**
   * What the pair is called as one thing.
   *
   * The eighteen palettes have proper nouns; the nine SCHEMES did not, and the
   * picker needs one — it shows a row per scheme with a light and a dark chip
   * on it, so "Sanctuary" and "Obsidian" have to sit under a shared heading.
   * Deliberately not either member's name (that would imply one is the real one
   * and the other a variant) and deliberately in the same mineral register.
   */
  family: string;
  /**
   * The id of this palette's opposite-scheme twin.
   *
   * Every palette has exactly one, and the relation is symmetric — see the
   * `PAIRS` table and the check below it. This is what makes "each scheme has a
   * light and a dark version" a property the code holds rather than a claim in
   * a comment, and it is what lets the picker put a pair on one row.
   */
  pair: string;
  colors: ColorTokens;
  glass: GlassTokens;
  gradients: GradientTokens;
}

function makePalette(id: string, pair: string, family: string, seed: PaletteSeed): Palette {
  const paletteColors = makeColors(seed);
  return {
    id,
    pair,
    family,
    label: seed.label,
    scheme: seed.scheme,
    colors: paletteColors,
    glass: makeGlass(seed, paletteColors),
    gradients: makeGradients(seed),
  };
}

/**
 * The nine schemes, each as a light/dark pair.
 *
 * A "scheme" here is a colour idea — the brand blue, the monochrome, the green
 * — and each one exists twice, lit from opposite ends. Listing them as pairs
 * rather than as eighteen independent palettes is what keeps that true: the
 * check below fails the build if a pair is one-sided, so a palette added
 * without a partner cannot ship.
 *
 * The order is also the layout: PaletteSwatches renders a row per pair, so
 * `LIGHT[i]` and `DARK[i]` are the two chips on row `i`. Verdant and Olive are
 * adjacent on purpose — they are the two greens, and neighbouring rows are the
 * only place a reader can actually compare them.
 *
 * Porphyry and Slate are the loosest pair of the nine: both are cool violets,
 * but Porphyry leans aubergine-rose and Slate periwinkle-indigo, where the
 * other eight pairs share a hue outright. Nudging Slate's accent violet-ward
 * would tighten it at the cost of the set's only neutral cool grey, so it is
 * left as drawn.
 */
/* Sanctuary and Obsidian are the hand-tuned originals in tokens.ts, kept
   verbatim rather than regenerated — the dark one especially carries measured
   decisions (see the notes on `glass.dark.tint`) a generic derivation would
   flatten. */
const SANCTUARY: Palette = {
  id: 'sanctuary',
  pair: 'obsidian',
  family: 'Azure',
  label: 'Sanctuary',
  scheme: 'light',
  colors: colors.light,
  glass: glass.light,
  gradients: gradients.light,
};

const OBSIDIAN: Palette = {
  id: 'obsidian',
  pair: 'sanctuary',
  family: 'Azure',
  label: 'Obsidian',
  scheme: 'dark',
  colors: colors.dark,
  glass: glass.dark,
  gradients: gradients.dark,
};

/** Light column, top to bottom. Index `i` pairs with `DARK[i]`. */
const LIGHT: Palette[] = [
  SANCTUARY,
  makePalette('porcelain', 'lapis', 'Ultramarine', SEEDS.porcelain),
  makePalette('marble', 'basalt', 'Limestone', SEEDS.marble),
  makePalette('papyrus', 'umber', 'Terracotta', SEEDS.papyrus),
  makePalette('harbour', 'verdigris', 'Patina', SEEDS.harbour),
  makePalette('celadon', 'serpentine', 'Verdant', SEEDS.celadon),
  makePalette('peridot', 'olivine', 'Olive', SEEDS.peridot),
  makePalette('slate', 'porphyry', 'Amethyst', SEEDS.slate),
  makePalette('chalk', 'ink', 'Graphite', SEEDS.chalk),
];

/** Dark column, top to bottom. Index `i` pairs with `LIGHT[i]`. */
const DARK: Palette[] = [
  OBSIDIAN,
  makePalette('lapis', 'porcelain', 'Ultramarine', SEEDS.lapis),
  makePalette('basalt', 'marble', 'Limestone', SEEDS.basalt),
  makePalette('umber', 'papyrus', 'Terracotta', SEEDS.umber),
  makePalette('verdigris', 'harbour', 'Patina', SEEDS.verdigris),
  makePalette('serpentine', 'celadon', 'Verdant', SEEDS.serpentine),
  makePalette('olivine', 'peridot', 'Olive', SEEDS.olivine),
  makePalette('porphyry', 'slate', 'Amethyst', SEEDS.porphyry),
  makePalette('ink', 'chalk', 'Graphite', SEEDS.ink),
];

export const palettes: Palette[] = [...LIGHT, ...DARK];

/*
 * The pairing has to be total and symmetric, and the two columns have to be the
 * same length or the grid stops putting partners on one row. Checked at module
 * load rather than trusted: all three are easy to break by adding a palette to
 * one array and forgetting the other, and the failure would otherwise be a
 * quietly mismatched row in the picker.
 */
if (LIGHT.length !== DARK.length) {
  throw new Error(`palettes: ${LIGHT.length} light vs ${DARK.length} dark — the columns must match`);
}
for (const palette of palettes) {
  const twin = palettes.find((p) => p.id === palette.pair);
  if (!twin) throw new Error(`palettes: "${palette.id}" pairs with unknown "${palette.pair}"`);
  if (twin.pair !== palette.id) {
    throw new Error(`palettes: "${palette.id}" pairs with "${twin.id}", which pairs with "${twin.pair}"`);
  }
  if (twin.scheme === palette.scheme) {
    throw new Error(`palettes: "${palette.id}" and its pair "${twin.id}" are both ${palette.scheme}`);
  }
  if (twin.family !== palette.family) {
    throw new Error(
      `palettes: "${palette.id}" is family "${palette.family}" but its pair "${twin.id}" is "${twin.family}"`,
    );
  }
}

export interface PalettePair {
  /** Shared name for the scheme — what the picker's row is labelled with. */
  family: string;
  light: Palette;
  dark: Palette;
}

/**
 * The eight schemes, each with both of its palettes.
 *
 * This is what the picker renders: one row per scheme, a light chip and a dark
 * chip on it. Built from the two columns rather than declared separately, so it
 * cannot drift from `palettes`.
 */
export const palettePairs: PalettePair[] = LIGHT.map((light, i) => ({
  family: light.family,
  light,
  dark: DARK[i],
}));

/**
 * Every radio in the picker, in the order a reader meets them: light then dark,
 * scheme by scheme. Row-major, unlike `palettes`, which stays grouped by scheme
 * for the stylesheet generator.
 */
export const paletteRadioOrder: Palette[] = palettePairs.flatMap((p) => [p.light, p.dark]);

/*
 * There used to be four `*_STATUE_FAMILIES` lists here, pairing each hero
 * artwork with the palette families whose accent it sat well beside: limestone
 * for the warm and green schemes, white for Amethyst, mono for Graphite,
 * ultramarine for Ultramarine, cyan for the remainder.
 *
 * Every palette now wears the ultramarine statue, so the pairing is a single
 * fact and it lives in the registry that owns it — `src/theme/statues.ts`,
 * where `ultramarine` is the artwork with `families: null`. The lists are gone
 * rather than emptied: four exported arrays that no longer decide anything
 * read like a mechanism still in use.
 *
 * If per-family artworks ever come back, they come back as `families` entries
 * on the registry. Nothing here needs to change for that — this note exists
 * only so the removal does not look like an accident.
 */

/**
 * The palette a first-time visitor gets, and the one emitted into bare `:root`.
 *
 * Ultramarine dark. `obsidian` held this for as long as it was the only
 * hand-tuned dark set; the generated Ultramarine reads as the firm's colour
 * rather than as a neutral with a blue accent on it, so it is the one the site
 * opens on. Changing this id moves the bare `:root` block in the generated
 * stylesheet — run `npm run generate:theme` after touching it.
 */
export const DEFAULT_PALETTE_ID = 'lapis';

export const paletteIds: string[] = palettes.map((p) => p.id);

export function paletteById(id: string | null | undefined): Palette {
  return (
    palettes.find((p) => p.id === id) ??
    // By id, not by index: the registry is grouped light-then-dark now, so
    // palettes[0] is Sanctuary and an unknown id would silently hand back a
    // light palette instead of the default.
    palettes.find((p) => p.id === DEFAULT_PALETTE_ID)!
  );
}

export function isPaletteId(id: unknown): id is string {
  return typeof id === 'string' && paletteIds.includes(id);
}
