import { useTranslation } from 'react-i18next';
import { FadeInSection } from '@/components/animations/FadeInSection';
import heroBg from '@/assets/images/hero-parthenon.png';
import './HeroSection.css';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <header className="hero-section">
      <div className="hero-section__bg">
        <img src={heroBg} alt="" className="hero-section__bg-img" />
        <div className="hero-section__bg-overlay" />
      </div>

      <div className="hero-section__bg-fade" />

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
