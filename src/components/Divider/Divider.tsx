import type { HTMLAttributes } from 'react';
import './Divider.css';

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  spacing?: 'sm' | 'md' | 'lg';
}

export function Divider({ spacing = 'md', className = '', ...props }: DividerProps) {
  return (
    <hr className={`divider divider--${spacing} ${className}`.trim()} {...props} />
  );
}
