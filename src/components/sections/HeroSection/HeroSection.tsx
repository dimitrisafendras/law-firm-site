import { useTranslation } from 'react-i18next';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { DigitalStatue } from '@/components/DigitalStatue/DigitalStatue';
import './HeroSection.css';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <header className="hero-section">
      <div className="hero-section__bg">
        <DigitalStatue />
      </div>

      {/* Digital circuit lines */}
      <svg className="hero-section__lines" fill="none" aria-hidden="true">
        {/* Horizontal lines */}
        <line x1="0%" y1="15%" x2="75%" y2="15%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.15" />
        <line x1="12%" y1="30%" x2="94%" y2="30%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
        <line x1="6%" y1="50%" x2="100%" y2="50%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.08" />
        <line x1="25%" y1="70%" x2="88%" y2="70%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.12" />
        <line x1="0%" y1="85%" x2="81%" y2="85%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
        {/* Vertical lines */}
        <line x1="25%" y1="0%" x2="25%" y2="62%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.08" />
        <line x1="62%" y1="12%" x2="62%" y2="100%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
        <line x1="88%" y1="0%" x2="88%" y2="75%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.06" />
        {/* Diagonal connector lines */}
        <line x1="25%" y1="15%" x2="62%" y2="30%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
        <line x1="62%" y1="30%" x2="88%" y2="70%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.08" />
        <line x1="75%" y1="15%" x2="62%" y2="50%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.06" />
        {/* Junction circles — fixed px radius, never distorted */}
        <circle cx="25%" cy="15%" r="3" fill="var(--accent)" opacity="0.2" />
        <circle cx="62%" cy="30%" r="2.5" fill="var(--accent)" opacity="0.15" />
        <circle cx="75%" cy="15%" r="2" fill="var(--accent)" opacity="0.18" />
        <circle cx="88%" cy="70%" r="3" fill="var(--accent)" opacity="0.12" />
        <circle cx="25%" cy="50%" r="2" fill="var(--accent)" opacity="0.15" />
        <circle cx="62%" cy="85%" r="2.5" fill="var(--accent)" opacity="0.1" />
        <circle cx="44%" cy="15%" r="1.5" fill="var(--accent)" opacity="0.2" />
        <circle cx="81%" cy="30%" r="1.5" fill="var(--accent)" opacity="0.15" />
        <circle cx="50%" cy="70%" r="1.5" fill="var(--accent)" opacity="0.12" />
      </svg>

      <div className="hero-section__content">
        <FadeInSection variant="fade-up" delay={0.2}>
          <span className="hero-section__badge">
            <span className="hero-section__badge-dot" aria-hidden="true" />
            {t('heroOverline')}
          </span>
        </FadeInSection>

        <FadeInSection variant="fade-up" delay={0.4}>
          <h1 className="hero-section__title">
            {t('heroTitleLine1')} <br />
            <span className="hero-section__title-gradient">{t('heroTitleLine2')}</span>
          </h1>
        </FadeInSection>

        <FadeInSection variant="fade-up" delay={0.6}>
          <p className="hero-section__subtitle">{t('heroSubtitle')}</p>
        </FadeInSection>

        <FadeInSection variant="fade-up" delay={0.8}>
          <div className="hero-section__stat-card">
            <span className="hero-section__stat-value">30+</span>
            <span className="hero-section__stat-label">{t('statYears')}</span>
          </div>
        </FadeInSection>
      </div>

      <div className="hero-section__scroll-hint" aria-hidden="true">
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
          <path d="M1 1l9 9 9-9" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </header>
  );
}
