import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import './FadeInSection.css';

type AnimationVariant = 'fade-up' | 'fade-left' | 'fade-right' | 'fade' | 'scale';

interface FadeInSectionProps {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'article';
  stagger?: number;
}

export function FadeInSection({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.7,
  threshold = 0.15,
  className = '',
  as: Tag = 'div',
  stagger = 0,
}: FadeInSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const style: CSSProperties = {
    '--fade-delay': `${delay + stagger}s`,
    '--fade-duration': `${duration}s`,
  } as CSSProperties;

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      className={`fade-section fade-section--${variant} ${isVisible ? 'fade-section--visible' : ''} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}

/** Wrapper that staggers children automatically */
interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  interval?: number;
}

export function StaggerGroup({ children, className = '', interval = 0.12 }: StaggerGroupProps) {
  return (
    <div className={`stagger-group ${className}`.trim()} style={{ '--stagger-interval': `${interval}s` } as CSSProperties}>
      {children}
    </div>
  );
}
