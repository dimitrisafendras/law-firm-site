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
    heroDeep: '#E8EDF5',
    heroDeepest: '#DCE5F2',
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
    /*
     * The ramp carries the hero's blue down the whole page.
     *
     * It used to run #202835 → #131720: a 13-per-channel luminance drop across
     * 8,600px, at roughly 25% saturation and 10–17% lightness — dark neutral in
     * practice. The body had no chroma source of its own (the only images below
     * the fold are greyscale), so every surface on it read as slate.
     *
     * These sit on the same navy the hero opens with, so the page is one
     * continuous blue that deepens rather than a blue hero on a grey document.
     * Luminance still descends monotonically stop to stop, which is what
     * carries the eye downward instead of pulling it back out at the bottom.
     */
    gradStop1: '#1B2A44',
    gradStop2: '#182540',
    gradStop3: '#152039',
    gradStop4: '#121B31',
    gradStop5: '#101729',
    gradStop6: '#0D1220',
    /* The hero's own deep stops — the two values it used to hardcode. */
    heroDeep: '#0F1A2E',
    heroDeepest: '#112240',
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
  /**
   * The one place a second family earns its keep.
   *
   * Jura has no italic. Every italic on this site — partner roles, every
   * testimonial quote — was a browser-synthesised oblique, which is a slanted
   * geometric sans and looks exactly as cheap as that sounds at 20px. EB
   * Garamond ships a true italic *and* Greek, which almost nothing else in
   * this register does.
   *
   * It also earns it structurally: Garamond against Jura is the same collision
   * the hero is built on — classical stone against digital light — so the
   * typography stops merely claiming "legacy and innovation" and enacts it.
   */
  serif: "'EB Garamond', Georgia, 'Times New Roman', serif",
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
  /**
   * Inscription size. Section titles live here.
   *
   * 40px semibold on a 1440px measure is timid — it reads as a subhead on a
   * page whose hero is a 95vh statue. At 80px the weight has to come *down*,
   * not up: Jura's 300 at this size reads as something cut into stone, where
   * 600 reads as a banner. This is the page's one big hierarchy jump.
   */
  displayXl: { size: '5rem', px: 80, weight: 300, lineHeight: '1.0', tracking: '-0.03em' },
  display: { size: '4.5rem', px: 72, weight: 300, lineHeight: '1.02', tracking: '-0.03em' },
  h1: { size: '2.5rem', px: 40, weight: 600, lineHeight: '1.08', tracking: '-0.025em' },
  h2: { size: '1.75rem', px: 28, weight: 600, lineHeight: '1.15', tracking: '-0.02em' },
  /** Card titles and the wordmark, which were both sitting here ad hoc. */
  h4: { size: '1.5rem', px: 24, weight: 500, lineHeight: '1.3', tracking: '-0.01em' },
  h3: { size: '1.25rem', px: 20, weight: 600, lineHeight: '1.25', tracking: '-0.01em' },
  bodyLg: { size: '1.125rem', px: 18, weight: 400, lineHeight: '1.6', tracking: '0' },
  body: { size: '1rem', px: 16, weight: 400, lineHeight: '1.6', tracking: '0' },
  small: { size: '0.875rem', px: 14, weight: 400, lineHeight: '1.5', tracking: '0' },
  caption: { size: '0.75rem', px: 12, weight: 500, lineHeight: '1.4', tracking: '0.01em' },
} as const;

/**
 * Tracking for uppercase micro-labels — two steps, and only two.
 *
 * The site had independently invented five (0.05, 0.15, 0.2, 0.3 and 0.35em),
 * which is how a scale rots: each label picked a value that looked right in
 * isolation. At 11-12px anything past 0.2em reads as gappy rather than as
 * spaced — "P A R T N E R  E T H O S" stops being a word.
 *
 * `tight` is for functional labels that must read fast (nav, form labels, stat
 * captions). `wide` is for the engraved register — overlines and chapter
 * markers, where the label is an ornament and slow reading is the point.
 */
export const capsTracking = {
  tight: '0.08em',
  wide: '0.2em',
} as const;

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
  h4: typeScale.h4.size,
  h2: typeScale.h2.size,
  h1: typeScale.h1.size,
  display: typeScale.display.size,
  displayXl: typeScale.displayXl.size,
} as const;

export const weights = {
  /** Jura's lower half, unused until the inscription sizes needed it. */
  light: 300,
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
  /*
   * The dark tint is LIGHTER than the surface it sits on, deliberately — and
   * it has been raised twice, for two different reasons.
   *
   * It began at rgba(24, 26, 31, …), darker than the page ramp behind it, so
   * every card receded into its own background and measured 1.05:1 against it.
   * Glass over a dark ground catches light: it reads lighter than what
   * surrounds it, not darker.
   *
   * rgba(52, 62, 82, 0.28) fixed that against a neutral slate ramp. It stopped
   * working when the ramp moved onto the hero's navy — 52/62/82 is close
   * enough in both hue and value to #152039 that a card composited to about
   * rgb(30, 40, 64) against a ground of rgb(21, 32, 57), which is a difference
   * you cannot see.
   *
   * The fix is a lighter tint rather than a heavier one: raising alpha on a
   * dark tint buys contrast by turning the glass opaque, which is the one
   * thing the material must not do. 78/94/122 at 0.38 separates the card
   * clearly while leaving it 62% transparent, and with lensing restored the
   * blur and saturate are doing real work behind it.
   */
  dark: {
    bg: 'rgba(78, 94, 122, 0.38)',
    bgStrong: 'rgba(78, 94, 122, 0.54)',
    border: 'rgba(255, 255, 255, 0.24)',
    shadow: '0 10px 30px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.3)',
    blur: '20px',
    blurStrong: '28px',
    saturate: '180%',
    tint: 'rgba(78, 94, 122, 0.38)',
    tintClear: 'rgba(78, 94, 122, 0.2)',
    highlight: 'rgba(255, 255, 255, 0.5)',
    edge: 'rgba(255, 255, 255, 0.24)',
    glow: 'rgba(188, 232, 255, 0.24)',
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

  /**
   * Section entrances, driven by `animation-timeline: view()` rather than by
   * an IntersectionObserver.
   *
   * `travel` is 24px, not the 40px this site used to run. 40px reads as a
   * slide — the element arrives from somewhere; 24px reads as a settle, which
   * is what an entrance should be when it happens twenty times down a page.
   *
   * `range` is how far into the element's entry the animation completes: 45%
   * means it is fully settled well before it reaches the middle of the
   * viewport, so nothing is still moving while it is being read.
   */
  enter: {
    travel: '24px',
    range: '45%',
  },

  /** Blur radii for blur-to-sharp materialisation. */
  blur: {
    spawn: '12px',
    spawnSoft: '6px',
    spawnTight: '8px',
  },
} as const;

// ─── Decoration ───────────────────────────────────────────────────────────────

/**
 * The dissolution field — the page's one decorative layer.
 *
 * These alphas are deliberately a *range*, not a value: the field's whole idea
 * is that the cubes have drifted off the statue, so density and opacity fall
 * away from the top-right. A single alpha would read as evenly-scattered
 * particles, which is the stock effect this replaces.
 */
export const decor = {
  fieldAlphaStrong: '0.14',
  fieldAlphaMid: '0.1',
  fieldAlphaFaint: '0.06',
  /*
   * Accent bloom strengths for the page ramp.
   *
   * The previous values (12 / 10 / 9 / 8 percent, fading out by ~62% radius)
   * put the brightest achievable pixel in the entire page body at about
   * #2D3845 — which is grey. At bloom scale a low alpha does not read as
   * subtle, it reads as absent.
   */
  bloomStrong: '20%',
  bloomMid: '16%',
  bloomSoft: '13%',
  /*
   * The practice cards' domain line-art.
   *
   * Higher than it looks like it should be, because this value is not the
   * opacity anything actually renders at — it multiplies. Every element inside
   * those SVGs carries its own opacity between 0.08 and 0.5, and the container
   * is masked on top of that, so at 0.25 the faintest strokes were landing
   * around 0.02 effective and the strongest around 0.125. The drawings were
   * present in the DOM and invisible on screen.
   */
  domainArt: '0.55',
  domainArtHover: '0.85',
} as const;

export const decorVarNames: Record<string, string> = {
  fieldAlphaStrong: '--field-alpha-strong',
  fieldAlphaMid: '--field-alpha-mid',
  fieldAlphaFaint: '--field-alpha-faint',
  bloomStrong: '--bloom-strong',
  bloomMid: '--bloom-mid',
  bloomSoft: '--bloom-soft',
  domainArt: '--domain-art',
  domainArtHover: '--domain-art-hover',
};

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
  heroDeep: '--hero-deep',
  heroDeepest: '--hero-deepest',
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
  light: '--weight-light',
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
  serif: '--serif',
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
  decor,
} as const;

export type Theme = typeof theme;
