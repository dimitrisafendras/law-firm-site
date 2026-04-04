import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './IconToggle.css';

interface IconToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function IconToggle({ children, className = '', ...props }: IconToggleProps) {
  return (
    <button className={`icon-toggle ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
