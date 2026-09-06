import type { ReactNode, CSSProperties } from 'react';
import './FadeInSection.css';

/**
 * `rise` is the site's one entrance. `none` opts a subtree out entirely.
 *
 * The horizontal variants are gone. Content converging from the left and right
 * on alternating rows is the single most recognisable template motion there
 * is, and it fought the reading order: the eye was pulled outward-in on every
 * partner row before it could start reading. Everything rises now.
 */
type AnimationVariant = 'rise' | 'none';

interface FadeInSectionProps {
  children: ReactNode;
  variant?: AnimationVariant;
  /**
   * Offset into the entrance range, as a fraction of one stagger step. Use it
   * where a sibling should trail another without being inside a StaggerGroup.
   */
  step?: number;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'article';
}

/**
 * A scroll-driven entrance wrapper.
 *
 * This used to be an IntersectionObserver that flipped a `--visible` class,
 * and it had two defects that were really one defect.
 *
 * The visible one: with `threshold = 0.35` on wrappers up to 800px tall, a
 * scroll fast enough to cross a section between observer callbacks never fired
 * it at all. Measured on the live page, a full top-to-bottom pass left 19 of
 * 26 wrappers stuck at `opacity: 0` with no `--visible` class — permanently
 * invisible for the rest of the session. Dragging the scrollbar showed a page
 * of empty screens; nav anchors landed on ghosts.
 *
 * The subtle one: animating opacity on a *wrapper* makes it a backdrop root,
 * so every glass surface inside it had to give up `backdrop-filter` entirely —
 * 24 of the site's 29 glass surfaces were flat panels quoting glass, because
 * the alternative was a visible colour snap when lensing switched on at the
 * end of the fade.
 *
 * `animation-timeline: view()` solves both. There is no observer to miss, and
 * the animation lives on the element itself — an element's *own* opacity does
 * not make it its own backdrop root, so a glass surface can carry an entrance
 * and live lensing at the same time, sampling the real page from frame one.
 *
 * Browsers without support get the `@supports` fallback, which is simply the
 * settled state: fully visible, no animation. That is also exactly what the
 * prerendered HTML should look like, so hydration has nothing to reconcile.
 */
export function FadeInSection({
  children,
  variant = 'rise',
  step = 0,
  className = '',
  as: Tag = 'div',
}: FadeInSectionProps) {
  const style = step > 0 ? ({ '--enter-step': String(step) } as CSSProperties) : undefined;

  return (
    <Tag className={`fade-section fade-section--${variant} ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
}

/**
 * Staggers its children's entrances.
 *
 * With a view() timeline a stagger is not a delay in seconds — it is an offset
 * into each child's own entry range, so the group reveals in order as it is
 * scrolled and re-conceals in order if the user scrolls back up. Nothing is
 * left mid-transition when scrolling stops.
 */
export function StaggerGroup({ children, className = '' }: StaggerGroupProps) {
  return <div className={`stagger-group ${className}`.trim()}>{children}</div>;
}
