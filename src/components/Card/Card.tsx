import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import './Card.css';

/**
 * The glass card's material variants.
 *
 * `clear` is the material's own variant — it is selected with
 * `data-variant="clear"` so the pseudo-element form (`.glass`) and the layered
 * component form (`GlassSurface`) answer to the same attribute. `strong` and
 * `glow` are this card's chrome on top of the regular material, so they stay
 * modifier classes.
 */
export type CardVariant = 'default' | 'clear' | 'strong' | 'glow';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  /**
   * The material's hover lensing — the illumination layer scales and comes up
   * to full. Use this when the card supplies its own hover chrome (a bigger
   * lift, an accent rim); use `clickable` when it should take the built-in one.
   */
  interactive?: boolean;
  /**
   * The built-in card hover: pointer cursor, a 2px lift, overlay elevation and
   * a saturation bump. Implies `interactive`.
   */
  clickable?: boolean;
  /**
   * Whether the material lenses — blurs and saturates what is behind it.
   *
   * On by default, and left on for anything that stands on the page itself.
   * Turn it off for a card that has to match one which *cannot* lens: a
   * `backdrop-filter` samples only what paints inside its backdrop root, and
   * every home-page section that carries `content-visibility: auto`
   * (PracticeGrid, PartnerEthos, TestimonialsSection) has paint containment and
   * is therefore a backdrop root with nothing in it. The cards in those sections
   * show a flat tint over the page; a card elsewhere on the site that is meant
   * to read as the same object has to say so. See src/styles/liquid-glass.css.
   */
  lensing?: boolean;
  /** Rendered element. `article`, `section`, `figure` and `blockquote` are all in use. */
  as?: ElementType;
  children: ReactNode;
}

/**
 * Card — the glass card, and the one place a glass surface is declared.
 *
 * It is deliberately a pass-through: `<Tag className>{children}</Tag>` and
 * nothing else. No wrapper element, no layer spans. That is not laziness, it is
 * the contract — two behaviours on this site depend on the card's children
 * being *its own* direct children:
 *
 *  1. `.glass > *` promotes every direct child to `position: relative`, so the
 *     material's two light layers stay underneath the copy. Cards whose whole
 *     surface is one stretched link work around that promotion in their own CSS
 *     (PartnerCard moves its content into a single positioned `__body`;
 *     PracticeGrid puts the promoted child back to
 *     `position: static`). Insert a wrapper here and every one of those click
 *     targets silently shrinks to the heading it stretches from.
 *  2. `.glass` spends both `::before` and `::after` on the material, so call
 *     sites that need a pseudo-element of their own borrow a child's (see
 *     `.partner-ethos__portrait::before`). A wrapper would move which element
 *     those selectors are relative to.
 *
 * When a surface needs a third layer — a legibility scrim — or has already
 * spent both pseudo-elements, `GlassSurface` is the layered form of the same
 * material. Everything that is card-shaped uses this.
 */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    variant = 'default',
    interactive = false,
    clickable = false,
    lensing = true,
    as,
    children,
    className = '',
    ...props
  },
  ref,
) {
  const Tag = (as ?? 'div') as ElementType;

  const classes = [
    'card',
    'glass',
    variant === 'strong' || variant === 'glow' ? `card--${variant}` : '',
    clickable ? 'card--clickable' : '',
    clickable || interactive ? 'glass--interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      ref={ref}
      className={classes}
      data-variant={variant === 'clear' ? 'clear' : undefined}
      data-lensing={lensing ? undefined : 'off'}
      {...props}
    >
      {children}
    </Tag>
  );
});

export function CardHeader({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card__header ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card__body ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card__footer ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
