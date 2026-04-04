import type { ReactNode, HTMLAttributes } from 'react';
import './GlassCard.css';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'glow';
  children: ReactNode;
}

export function GlassCard({
  variant = 'default',
  children,
  className = '',
  ...props
}: GlassCardProps) {
  const variantClass = variant !== 'default' ? `glass-card--${variant}` : '';
  return (
    <div className={`glass-card ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
