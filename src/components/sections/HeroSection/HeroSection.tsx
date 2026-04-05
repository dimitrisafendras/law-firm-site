import { useTranslation } from 'react-i18next';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { MatrixRain } from '@/components/MatrixRain/MatrixRain';
import heroBg from '@/assets/images/hero-acropolis.png';
import './HeroSection.css';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <header className="hero-section">
      <MatrixRain className="hero-section__matrix" />
      <div className="hero-section__bg">
        <img src={heroBg} alt="" className="hero-section__bg-img" />
        <div className="hero-section__bg-overlay" />
      </div>

      <div className="hero-section__bg-fade" />

      {/* Digital circuit lines */}
      <svg className="hero-section__lines" viewBox="0 0 800 800" fill="none" aria-hidden="true">
        {/* Horizontal data lines */}
        <line x1="0" y1="120" x2="600" y2="120" stroke="var(--accent)" strokeWidth="0.5" opacity="0.15" />
        <line x1="100" y1="240" x2="750" y2="240" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
        <line x1="50" y1="400" x2="800" y2="400" stroke="var(--accent)" strokeWidth="0.5" opacity="0.08" />
        <line x1="200" y1="560" x2="700" y2="560" stroke="var(--accent)" strokeWidth="0.5" opacity="0.12" />
        <line x1="0" y1="680" x2="650" y2="680" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />

        {/* Vertical data lines */}
        <line x1="200" y1="0" x2="200" y2="500" stroke="var(--accent)" strokeWidth="0.5" opacity="0.08" />
        <line x1="500" y1="100" x2="500" y2="800" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
        <line x1="700" y1="0" x2="700" y2="600" stroke="var(--accent)" strokeWidth="0.5" opacity="0.06" />

        {/* Circuit nodes */}
        <circle cx="200" cy="120" r="3" fill="var(--accent)" opacity="0.2" />
        <circle cx="500" cy="240" r="2.5" fill="var(--accent)" opacity="0.15" />
        <circle cx="600" cy="120" r="2" fill="var(--accent)" opacity="0.18" />
        <circle cx="700" cy="560" r="3" fill="var(--accent)" opacity="0.12" />
        <circle cx="200" cy="400" r="2" fill="var(--accent)" opacity="0.15" />
        <circle cx="500" cy="680" r="2.5" fill="var(--accent)" opacity="0.1" />

        {/* Diagonal connector lines */}
        <line x1="200" y1="120" x2="500" y2="240" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
        <line x1="500" y1="240" x2="700" y2="560" stroke="var(--accent)" strokeWidth="0.5" opacity="0.08" />
        <line x1="600" y1="120" x2="500" y2="400" stroke="var(--accent)" strokeWidth="0.5" opacity="0.06" />

        {/* Small static pulse dots */}
        <circle cx="350" cy="120" r="1.5" fill="var(--accent)" opacity="0.2" />
        <circle cx="650" cy="240" r="1.5" fill="var(--accent)" opacity="0.15" />
        <circle cx="400" cy="560" r="1.5" fill="var(--accent)" opacity="0.12" />
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

        {/* Floating stat card */}
        <FadeInSection variant="fade-up" delay={0.8}>
          <div className="hero-section__stat-card">
            <span className="hero-section__stat-value">20+</span>
            <span className="hero-section__stat-label">{t('statYears')}</span>
          </div>
        </FadeInSection>
      </div>
    </header>
  );
}
