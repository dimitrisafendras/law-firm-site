import type { ReactNode, ElementType, HTMLAttributes } from 'react';
import './Card.css';

interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'strong' | 'glow';
  clickable?: boolean;
  as?: ElementType;
  children: ReactNode;
}

export function Card({
  variant = 'default',
  clickable = false,
  as: Tag = 'div',
  children,
  className = '',
  ...props
}: CardProps) {
  const classes = [
    'card',
    variant !== 'default' ? `card--${variant}` : '',
    clickable ? 'card--clickable' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}

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
