import type { ReactNode, HTMLAttributes } from 'react';
import './Section.css';

type SectionVariant = 'default' | 'surface' | 'accent';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: SectionVariant;
  children: ReactNode;
}

export function Section({
  variant = 'default',
  children,
  className = '',
  ...props
}: SectionProps) {
  return (
    <section
      className={`section section--${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </section>
  );
}
