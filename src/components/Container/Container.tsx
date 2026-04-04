import type { ReactNode, HTMLAttributes } from 'react';
import './Container.css';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  as?: 'div' | 'section' | 'main' | 'article';
}

export function Container({
  children,
  as: Tag = 'div',
  className = '',
  ...props
}: ContainerProps) {
  return (
    <Tag className={`container ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
