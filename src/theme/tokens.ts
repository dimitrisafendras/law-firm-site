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
    border: 'rgba(0, 43, 73, 0.15)',
    codeBg: '#F0F0F0',
    accent: '#89CFF0',
    accentBg: 'rgba(137, 207, 240, 0.15)',
    accentBorder: 'rgba(137, 207, 240, 0.5)',
    accentContainer: '#BCE8FF',
    secondary: '#002B49',
    tertiary: '#FFB775',
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
    surface: '#111317',
    border: 'rgba(64, 72, 77, 0.15)',
    codeBg: '#1A1C20',
    accent: '#BCE8FF',
    accentBg: 'rgba(188, 232, 255, 0.1)',
    accentBorder: 'rgba(188, 232, 255, 0.3)',
    accentContainer: '#89CFF0',
    secondary: '#89CFF0',
    tertiary: '#FFB775',
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
  maxWidth: '1280px',
} as const;

// ─── Transitions ──────────────────────────────────────────────────────────────

export const transitions = {
  default: '0.3s',
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
  accentBg: '--accent-bg',
  accentBorder: '--accent-border',
  accentContainer: '--accent-container',
  secondary: '--secondary',
  tertiary: '--tertiary',
  onAccent: '--on-accent',
  socialBg: '--social-bg',
  surfaceContainerLow: '--surface-container-low',
  surfaceContainerHigh: '--surface-container-high',
  surfaceVariant: '--surface-variant',
  outline: '--outline',
  shadow: '--shadow',
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
  breakpoints,
  layout,
  transitions,
} as const;

export type Theme = typeof theme;
