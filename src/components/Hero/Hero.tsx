import type { ReactNode } from 'react';
import './Hero.css';

interface HeroProps {
  overline?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  image?: ReactNode;
}

export function Hero({ overline, title, subtitle, actions, image }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__content">
          {overline && <span className="hero__overline">{overline}</span>}
          <h1 className="hero__title">{title}</h1>
          {subtitle && <p className="hero__subtitle">{subtitle}</p>}
          {actions && <div className="hero__actions">{actions}</div>}
        </div>
        {image && <div className="hero__image">{image}</div>}
      </div>
    </section>
  );
}
