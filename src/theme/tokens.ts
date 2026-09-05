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

/**
 * The six gradient stops run LIGHTEST to DARKEST, and the sections consume them
 * in page order (PracticeGrid on 1, ContactSection on 6). The page therefore
 * settles as it scrolls rather than opening up, which is what carries the eye
 * down into the footer instead of pulling it back out at the bottom.
 *
 * Reverse these six values and the whole page ramp flips — no stylesheet needs
 * to change, because every section references its stop by number.
 */
export const colors = {
  light: {
    text: '#002B49',
    textHeading: '#002B49',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    gradStop1: '#FFFFFF',
    gradStop2: '#FAFAFA',
    gradStop3: '#F8F7FA',
    gradStop4: '#F6F6F9',
    gradStop5: '#F4F5F8',
    gradStop6: '#F2F4F7',
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
    gradStop1: '#202835',
    gradStop2: '#1D2430',
    gradStop3: '#1A202C',
    gradStop4: '#171D28',
    gradStop5: '#151A24',
    gradStop6: '#131720',
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
  sans: "'Jura', sans-serif",
  heading: "'Jura', sans-serif",
  label: "'Jura', sans-serif",
  mono: 'ui-monospace, Consolas, monospace',
} as const;

/**
 * Type scale — the eight Liquid Glass steps, set in Jura.
 *
 * Sizes, weights, line heights and tracking come from the design system; the
 * family does not. Jura is narrower and more geometric than the system's own
 * Comfortaa, so it carries the tight display tracking comfortably.
 *
 * Each step is the whole specimen, not a loose size: a heading that takes the
 * size but keeps a stray weight or tracking is the usual way a scale rots.
 */
export const typeScale = {
  display: { size: '3.5rem', px: 56, weight: 620, lineHeight: '1.02', tracking: '-0.03em' },
  h1: { size: '2.5rem', px: 40, weight: 600, lineHeight: '1.08', tracking: '-0.025em' },
  h2: { size: '1.75rem', px: 28, weight: 600, lineHeight: '1.15', tracking: '-0.02em' },
  h3: { size: '1.25rem', px: 20, weight: 600, lineHeight: '1.25', tracking: '-0.01em' },
  bodyLg: { size: '1.125rem', px: 18, weight: 400, lineHeight: '1.6', tracking: '0' },
  body: { size: '1rem', px: 16, weight: 400, lineHeight: '1.6', tracking: '0' },
  small: { size: '0.875rem', px: 14, weight: 400, lineHeight: '1.5', tracking: '0' },
  caption: { size: '0.75rem', px: 12, weight: 500, lineHeight: '1.4', tracking: '0.01em' },
} as const;

/**
 * Tracking for uppercase micro-labels.
 *
 * The caption step's own 0.01em is tuned for mixed case; uppercase Jura at 12px
 * closes up badly at that value, and every uppercase label on the site had
 * independently invented its own wider tracking. This is that value, once.
 */
export const capsTracking = '0.05em';

/**
 * Text emphasis levels, as opacities applied to `--text`.
 *
 * These are contrast floors, not taste. Measured against the glass tint on a
 * dark canvas: 0.5 lands a 12px label at 4.34:1, just under the 4.5:1 WCAG AA
 * threshold, and the 0.35 the partner meta-labels were using measured 2.77:1.
 * `muted` is the lowest value that still clears AA at 11-12px; anything quieter
 * than this belongs to a decorative layer, not to text.
 */
export const textEmphasis = {
  /** Body-adjacent secondary copy. */
  secondary: '0.7',
  /** Micro-labels and captions. The AA floor. */
  muted: '0.65',
} as const;

/** Bare sizes, derived from the scale above so the two can never drift. */
export const fontSizes = {
  caption: typeScale.caption.size,
  small: typeScale.small.size,
  body: typeScale.body.size,
  bodyLg: typeScale.bodyLg.size,
  h3: typeScale.h3.size,
  h2: typeScale.h2.size,
  h1: typeScale.h1.size,
  display: typeScale.display.size,
} as const;

export const weights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  display: 620,
  bold: 700,
} as const;

export const lineHeights = {
  tight: typeScale.h1.lineHeight,
  normal: typeScale.h3.lineHeight,
  relaxed: typeScale.body.lineHeight,
} as const;

export const letterSpacings = {
  tight: typeScale.display.tracking,
  normal: typeScale.h2.tracking,
  wide: typeScale.caption.tracking,
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

/**
 * Spacing — the design system's 4px grid.
 *
 * Steps 1-16 are the system's own. 20 and 24 are a documented extension: the
 * scale stops at 64px, which is a control-layer measure, and this site's
 * sections breathe at roughly 100px. Extending the same grid keeps section
 * rhythm on it rather than sending every section back to a magic number.
 */
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

// ─── Radii ────────────────────────────────────────────────────────────────────

/**
 * Radii — the design system's scale.
 *
 * This is the change the eye notices most. The site's previous 2px/4px corners
 * read as cut stone; glass is a poured material and needs the softer corner to
 * be legible as glass at all. `full` is for pills and avatars.
 */
export const radii = {
  sm: '6px',
  md: '8px',
  lg: '10px',
  xl: '14px',
  '2xl': '18px',
  '3xl': '22px',
  full: '9999px',
} as const;

// ─── Breakpoints ──────────────────────────────────────────────────────────────
// This is the single source of truth for the mobile breakpoint. JS reads it via
// this token (e.g. ANIMATION_CONFIG.mobileBreakpoint in DigitalStatue.tsx).
// CSS `@media (max-width: 1024px)` rules across the stylesheets necessarily
// hard-code the same 1024px value — CSS media queries can't reference JS/TS
// tokens — so keep them in sync with this value if it ever changes.

export const breakpoints = {
  mobile: '1024px',
} as const;

// ─── Layout ───────────────────────────────────────────────────────────────────

export const layout = {
  maxWidth: '1440px',
} as const;

// ─── Glass ───────────────────────────────────────────────────────────────────

/**
 * Glass — the Liquid Glass material.
 *
 * Three conceptual layers, per the material's own description: a **highlight**
 * (specular light on the top edge), an **illumination** (interior glow that
 * lenses what is behind), and a **shadow** (depth separation). The material
 * itself is `backdrop-filter: blur() saturate()` — the saturate is what makes
 * it concentrate the colour of whatever it floats above, and dropping it is
 * what turns glass back into a flat translucent panel.
 *
 * Tint and glow are this site's colours, not the system's: the tint is the
 * surface grey (#181A1F) and the glow is the baby-blue accent (#BCE8FF), so
 * the material reads as this brand rather than the reference blue. Highlight
 * and edge stay white alphas — they are light, not brand.
 *
 * `bg` / `bgStrong` / `border` / `blur` are kept under their original names so
 * the surfaces that already consume them keep working while they migrate.
 */
export const glass = {
  light: {
    bg: 'rgba(255, 255, 255, 0.55)',
    bgStrong: 'rgba(255, 255, 255, 0.65)',
    border: 'rgba(255, 255, 255, 0.5)',
    shadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
    blur: '20px',
    blurStrong: '28px',
    saturate: '180%',
    tint: 'rgba(255, 255, 255, 0.55)',
    tintClear: 'rgba(255, 255, 255, 0.24)',
    highlight: 'rgba(255, 255, 255, 0.7)',
    edge: 'rgba(255, 255, 255, 0.5)',
    glow: 'rgba(255, 255, 255, 0.45)',
  },
  dark: {
    bg: 'rgba(24, 26, 31, 0.5)',
    bgStrong: 'rgba(24, 26, 31, 0.72)',
    border: 'rgba(255, 255, 255, 0.14)',
    shadow: '0 10px 30px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.3)',
    blur: '20px',
    blurStrong: '28px',
    saturate: '180%',
    tint: 'rgba(24, 26, 31, 0.5)',
    tintClear: 'rgba(24, 26, 31, 0.28)',
    highlight: 'rgba(255, 255, 255, 0.28)',
    edge: 'rgba(255, 255, 255, 0.14)',
    glow: 'rgba(188, 232, 255, 0.14)',
  },
} as const;

/**
 * The two material variants. `clear` is thinner and only belongs over bright,
 * busy content — and needs a scrim there, or light text loses its contrast.
 */
export const materials = {
  regular: { blur: '20px', saturate: '180%' },
  clear: { blur: '14px', saturate: '150%' },
} as const;

/**
 * Elevation — depth separation from the canvas.
 *
 * Dark-theme values: this app renders dark-only, and the system's light-theme
 * shadows are far too weak to separate anything from a near-black canvas.
 */
export const elevations = {
  flat: 'none',
  raised: '0 2px 8px rgba(0, 0, 0, 0.3)',
  floating: '0 10px 30px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.3)',
  overlay: '0 18px 46px rgba(0, 0, 0, 0.55), 0 4px 10px rgba(0, 0, 0, 0.35)',
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
  saturate: '--glass-saturate',
  tint: '--glass-tint',
  tintClear: '--glass-tint-clear',
  highlight: '--glass-highlight',
  edge: '--glass-edge',
  glow: '--glass-glow',
};

export const radiusVarNames: Record<string, string> = {
  sm: '--radius-sm',
  md: '--radius-md',
  lg: '--radius-lg',
  xl: '--radius-xl',
  '2xl': '--radius-2xl',
  '3xl': '--radius-3xl',
  full: '--radius-full',
};

export const spacingVarNames: Record<string, string> = {
  0: '--space-0',
  1: '--space-1',
  2: '--space-2',
  3: '--space-3',
  4: '--space-4',
  6: '--space-6',
  8: '--space-8',
  12: '--space-12',
  16: '--space-16',
  20: '--space-20',
  24: '--space-24',
};

export const weightVarNames: Record<string, string> = {
  regular: '--weight-regular',
  medium: '--weight-medium',
  semibold: '--weight-semibold',
  display: '--weight-display',
  bold: '--weight-bold',
};

export const textEmphasisVarNames: Record<string, string> = {
  secondary: '--text-emphasis-secondary',
  muted: '--text-emphasis-muted',
};

export const layoutVarNames: Record<string, string> = {
  maxWidth: '--layout-max-width',
};

export const elevationVarNames: Record<string, string> = {
  flat: '--elev-flat',
  raised: '--elev-raised',
  floating: '--elev-floating',
  overlay: '--elev-overlay',
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
  materials,
  elevations,
  typeScale,
  weights,
  capsTracking,
  textEmphasis,
  gradients,
  breakpoints,
  layout,
  transitions,
  motion,
} as const;

export type Theme = typeof theme;
