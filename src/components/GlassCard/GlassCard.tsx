import type { ReactNode, HTMLAttributes } from 'react';
import './GlassCard.css';

type GlassIntensity = 'light' | 'medium' | 'strong';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  intensity?: GlassIntensity;
  glow?: boolean;
  children: ReactNode;
}

export function GlassCard({
  intensity = 'medium',
  glow = false,
  children,
  className = '',
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`glass-card glass-card--${intensity} ${glow ? 'glass-card--glow' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
