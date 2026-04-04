import type { ReactNode, HTMLAttributes } from 'react';
import './Card.css';

type CardVariant = 'default' | 'bordered' | 'elevated' | 'glass' | 'glass-strong';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
}

export function Card({
  variant = 'default',
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div className={`card card--${variant} ${className}`.trim()} {...props}>
      {children}
    </div>
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
