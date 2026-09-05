/**
 * Centralized design tokens for the law firm website.
 * All design values (colors, typography, spacing, etc.) should be defined here
 * and referenced via CSS custom properties or this module — never hardcoded.
 *
 * Design system: "The Monolithic Sanctuary"
 * Light: baby-blue primary (#89CFF0), deep secondary (#002B49), soft neutral bg.
 * Dark: obsidian surfaces, baby-blue accent with tonal depth (no hard borders).
 */

// ─── Colors ───────────────────────────────────────────────────────────────────

export const colors = {
  light: {
    text: '#002B49',
    textHeading: '#002B49',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    gradStop1: '#F2F4F7',
    gradStop2: '#F4F5F8',
    gradStop3: '#F6F6F9',
    gradStop4: '#F8F7FA',
    gradStop5: '#FAFAFA',
    gradStop6: '#FFFFFF',
    border: 'rgba(0, 43, 73, 0.15)',
    codeBg: '#F0F0F0',
    accent: '#89CFF0',
    accentText: '#1A6B8A',
    accentBg: 'rgba(137, 207, 240, 0.15)',
    accentBorder: 'rgba(137, 207, 240, 0.5)',
    accentContainer: '#BCE8FF',
    secondary: '#002B49',
    tertiary: '#FFB775',
    error: '#C53030',
    onAccent: '#002B49',
    socialBg: 'rgba(240, 240, 240, 0.5)',
    surfaceContainerLow: '#F0F0F0',
    surfaceVariant: 'rgba(255, 255, 255, 0.6)',
    outline: 'rgba(0, 43, 73, 0.15)',
    shadow: 'rgba(0, 0, 0, 0.06) 0 10px 15px -3px, rgba(0, 0, 0, 0.03) 0 4px 6px -2px',
  },
  dark: {
    text: '#E2E2E8',
    textHeading: '#E2E2E8',
    background: '#111317',
    surface: '#181A1F',
    gradStop1: '#131720',
    gradStop2: '#151A24',
    gradStop3: '#171D28',
    gradStop4: '#1A202C',
    gradStop5: '#1D2430',
    gradStop6: '#202835',
    border: 'rgba(64, 72, 77, 0.15)',
    codeBg: '#1A1C20',
    accent: '#BCE8FF',
    accentText: '#BCE8FF',
    accentBg: 'rgba(188, 232, 255, 0.1)',
    accentBorder: 'rgba(188, 232, 255, 0.3)',
    accentContainer: '#89CFF0',
    secondary: '#89CFF0',
    tertiary: '#FFB775',
    error: '#FC8181',
    onAccent: '#111317',
    socialBg: 'rgba(26, 28, 32, 0.5)',
    surfaceContainerLow: '#1A1C20',
    surfaceContainerHigh: '#282A2E',
    surfaceVariant: 'rgba(51, 53, 57, 0.6)',
    outline: 'rgba(64, 72, 77, 0.15)',
    shadow: 'rgba(226, 226, 232, 0.04) 0 0 40px',
  },
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const fonts = {
  sans: "'Manrope', sans-serif",
  heading: "'Newsreader', serif",
  label: "'Space Grotesk', sans-serif",
  mono: 'ui-monospace, Consolas, monospace',
} as const;

export const fontSizes = {
  xs: '13px',
  sm: '15px',
  base: '18px',
  baseMobile: '16px',
  lg: '20px',
  xl: '24px',
  '2xl': '36px',
  '3xl': '56px',
} as const;

export const lineHeights = {
  tight: '118%',
  normal: '135%',
  relaxed: '145%',
} as const;

export const letterSpacings = {
  tight: '-1.68px',
  normal: '-0.24px',
  wide: '0.18px',
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '32px',
  8: '48px',
  9: '88px',
} as const;

// ─── Radii ────────────────────────────────────────────────────────────────────

export const radii = {
  sm: '2px',
  md: '4px',
} as const;

// ─── Breakpoints ──────────────────────────────────────────────────────────────

export const breakpoints = {
  mobile: '1024px',
} as const;

// ─── Layout ───────────────────────────────────────────────────────────────────

export const layout = {
  maxWidth: '1440px',
} as const;

// ─── Glass ───────────────────────────────────────────────────────────────────

export const glass = {
  light: {
    bg: 'rgba(255, 255, 255, 0.45)',
    bgStrong: 'rgba(255, 255, 255, 0.65)',
    border: 'rgba(255, 255, 255, 0.5)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    blur: '16px',
    blurStrong: '24px',
  },
  dark: {
    bg: 'rgba(24, 26, 31, 0.8)',
    bgStrong: 'rgba(24, 26, 31, 0.9)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    blur: '16px',
    blurStrong: '24px',
  },
} as const;

// ─── Gradients ───────────────────────────────────────────────────────────────

export const gradients = {
  light: {
    glassA: 'linear-gradient(135deg, #89CFF0 0%, #002B49 100%)',
    glassB: 'linear-gradient(160deg, #002B49 0%, #89CFF0 50%, #FFB775 100%)',
  },
  dark: {
    glassA: 'linear-gradient(135deg, #0D3B5C 0%, #0A1628 100%)',
    glassB: 'linear-gradient(160deg, #0A1628 0%, #0D3B5C 50%, #4A2E10 100%)',
  },
} as const;

// ─── Transitions ──────────────────────────────────────────────────────────────

export const transitions = {
  default: '0.3s',
} as const;

// ─── Motion ───────────────────────────────────────────────────────────────────
// Single source of truth for entrance/"spawn" choreography. Mirrored as CSS
// custom properties in src/index.css — never inline these values in CSS.

export const motion = {
  /** Easing curves. All decelerating — nothing overshoots or bounces. */
  easing: {
    /** Expo-out. Fast commit, long settle. Used for elements arriving. */
    spawn: 'cubic-bezier(0.16, 1, 0.3, 1)',
    /** Gentle deceleration for small positional settles. */
    settle: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
    /** Slow-in/slow-out. Used for clip-path wipes and traces. */
    wipe: 'cubic-bezier(0.7, 0, 0.2, 1)',
  },

  /** Durations. */
  duration: {
    /** One character/word of a split-text reveal. */
    spawnChar: '0.7s',
    /** One whole element (badge, card, hint). */
    spawnElement: '0.8s',
    /** A clip-path wipe across a decorative layer. Matches `materialize`
     *  so a backdrop and its overlaid graphics land as one beat. */
    wipe: '1.2s',
    /** The hero backdrop materialize — exactly 3 sequence beats. */
    materialize: '1.2s',
  },

  /**
   * The single pacing dial. Every element in a hero starts at a whole (or half)
   * multiple of one beat, so nothing arrives at the same time as anything else
   * and the eye is led through the composition one step at a time.
   * Raise it to slow the whole entrance down; lower it to tighten everything.
   */
  sequence: {
    beat: '0.4s',
    beatTight: '0.28s',
  },

  /** Per-unit offsets *within* a single sequence step. */
  stagger: {
    /** Between characters of a split display line. */
    char: '0.03s',
    charTight: '0.018s',
    /** Between words of split body copy. */
    word: '0.025s',
    /** Between sibling decorations inside one step (e.g. circuit junctions). */
    elementTight: '0.09s',
  },

  /** Blur radii for blur-to-sharp materialisation. */
  blur: {
    spawn: '12px',
    spawnSoft: '6px',
    spawnTight: '8px',
  },
} as const;

// ─── Token → CSS variable name mapping ───────────────────────────────────────
// Single place that defines the CSS custom property name for each token key.

export const colorVarNames: Record<string, string> = {
  text: '--text',
  textHeading: '--text-h',
  background: '--bg',
  surface: '--surface',
  border: '--border',
  codeBg: '--code-bg',
  accent: '--accent',
  accentText: '--accent-text',
  accentBg: '--accent-bg',
  accentBorder: '--accent-border',
  accentContainer: '--accent-container',
  secondary: '--secondary',
  tertiary: '--tertiary',
  error: '--error',
  onAccent: '--on-accent',
  socialBg: '--social-bg',
  surfaceContainerLow: '--surface-container-low',
  surfaceContainerHigh: '--surface-container-high',
  surfaceVariant: '--surface-variant',
  outline: '--outline',
  shadow: '--shadow',
  gradStop1: '--grad-1',
  gradStop2: '--grad-2',
  gradStop3: '--grad-3',
  gradStop4: '--grad-4',
  gradStop5: '--grad-5',
  gradStop6: '--grad-6',
};

export const glassVarNames: Record<string, string> = {
  bg: '--glass-bg',
  bgStrong: '--glass-bg-strong',
  border: '--glass-border',
  shadow: '--glass-shadow',
  blur: '--glass-blur',
  blurStrong: '--glass-blur-strong',
};

export const gradientVarNames: Record<string, string> = {
  glassA: '--gradient-glass-a',
  glassB: '--gradient-glass-b',
};

export const fontVarNames: Record<string, string> = {
  sans: '--sans',
  heading: '--heading',
  label: '--label',
  mono: '--mono',
};

// ─── Aggregate theme object ───────────────────────────────────────────────────

export const theme = {
  colors,
  fonts,
  fontSizes,
  lineHeights,
  letterSpacings,
  spacing,
  radii,
  glass,
  gradients,
  breakpoints,
  layout,
  transitions,
  motion,
} as const;

export type Theme = typeof theme;
