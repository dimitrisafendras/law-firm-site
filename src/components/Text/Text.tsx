import type { ReactNode, HTMLAttributes } from 'react';
import './Text.css';

type TextVariant = 'body' | 'lead' | 'small' | 'label' | 'overline';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

type TextTag = 'p' | 'span' | 'div' | HeadingLevel;

interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  as?: TextTag;
  children: ReactNode;
}

export function Text({
  variant = 'body',
  as,
  children,
  className = '',
  ...props
}: TextProps) {
  const Tag = as ?? (variant === 'label' || variant === 'overline' ? 'span' : 'p');
  return (
    <Tag className={`text text--${variant} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  children: ReactNode;
}

export function Heading({
  level = 2,
  children,
  className = '',
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as HeadingLevel;
  return (
    <Tag className={`heading heading--${level} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
