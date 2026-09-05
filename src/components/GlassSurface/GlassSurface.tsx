import { forwardRef } from 'react';
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';

/** 35% black — enough for light body text over the brightest backdrop, without
 *  flattening the material into an opaque panel. */
const DEFAULT_SCRIM_OPACITY = 0.35;

export interface GlassSurfaceProps extends HTMLAttributes<HTMLElement> {
  /**
   * `regular` (default) — adaptive, legible over anything.
   * `clear` — thinner and more transparent; only over bright media, and it
   * usually needs a `scrim` there.
   */
  variant?: 'regular' | 'clear';
  /** Accent-tinted glass for emphasis surfaces. */
  tone?: 'neutral' | 'accent';
  /** Enables the hover lensing shift — a 2px lift and a saturation bump. */
  interactive?: boolean;
  /** Corner radius. Defaults to the material's own `--radius-3xl`. */
  radius?: string;
  /**
   * Dimming scrim between the material and the content.
   *
   * `clear` glass over bright, busy content does not darken its backdrop enough
   * for light text to hold contrast. `true` applies 35% black; pass a number
   * for a specific opacity.
   */
  scrim?: boolean | number;
  /** Rendered element. A nav bar wants `<nav>`, a card `<article>`. */
  as?: ElementType;
  /**
   * Class for the inner content layer. Needed when the surface has to lay its
   * own children out — the content layer, not the root, is their containing
   * block, so a flex column belongs here rather than on `className`.
   */
  contentClassName?: string;
  children?: ReactNode;
}

/**
 * GlassSurface — the Liquid Glass material as a component.
 *
 * Renders the three layers the material is defined by: highlight (specular
 * light on the top edge), illumination (interior glow that lenses the backdrop)
 * and shadow (depth separation, carried by the root's box-shadow). An opt-in
 * scrim sits above those and below the content.
 *
 * The material lives on the root so `backdrop-filter` samples what is behind
 * the whole surface; the layers are absolutely positioned siblings so none of
 * them can be knocked out of alignment by the surface's own padding. Styling
 * and the accessibility fallbacks are in src/styles/liquid-glass.css.
 */
export const GlassSurface = forwardRef<HTMLElement, GlassSurfaceProps>(function GlassSurface(
  {
    variant = 'regular',
    tone = 'neutral',
    interactive = false,
    radius,
    scrim = false,
    as,
    className,
    contentClassName,
    style,
    children,
    ...rest
  },
  ref,
) {
  const Tag = (as ?? 'div') as ElementType;
  const scrimOpacity = scrim === true ? DEFAULT_SCRIM_OPACITY : scrim === false ? 0 : scrim;

  const surfaceStyle: CSSProperties = radius
    ? ({ '--ds-glass-radius': radius, ...style } as CSSProperties)
    : (style ?? {});

  return (
    <Tag
      ref={ref}
      data-variant={variant}
      data-tone={tone === 'accent' ? 'accent' : undefined}
      data-interactive={interactive || undefined}
      className={`ds-glass ${className ?? ''}`.trim()}
      style={surfaceStyle}
      {...rest}
    >
      <span className="ds-glass__illumination" aria-hidden="true" />
      <span className="ds-glass__highlight" aria-hidden="true" />
      {scrimOpacity > 0 && (
        <span className="ds-glass__scrim" aria-hidden="true" style={{ opacity: scrimOpacity }} />
      )}
      <div className={`ds-glass__content ${contentClassName ?? ''}`.trim()}>{children}</div>
    </Tag>
  );
});
