import type { ReactNode, HTMLAttributes } from 'react';
import './Badge.css';

type BadgeVariant = 'default' | 'accent' | 'outline';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

export function Badge({
  variant = 'default',
  children,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span className={`badge badge--${variant} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
