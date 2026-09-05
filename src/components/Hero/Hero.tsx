import type { ReactNode } from 'react';
import { SpawnText } from '@/components/animations/SpawnText';
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
          {/* The per-character spans are decorative — the readable string lives
              on the heading's aria-label. */}
          <h1 className="hero__title" aria-label={title}>
            <span aria-hidden="true">
              <SpawnText text={title} />
            </span>
          </h1>
          {subtitle && (
            <p className="hero__subtitle">
              <SpawnText text={subtitle} mode="word" />
            </p>
          )}
          {actions && <div className="hero__actions">{actions}</div>}
        </div>
        {image && <div className="hero__image">{image}</div>}
      </div>
    </section>
  );
}
