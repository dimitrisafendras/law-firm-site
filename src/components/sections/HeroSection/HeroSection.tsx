import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';
import { FadeInSection } from '@/components/animations/FadeInSection';
import heroBg from '@/assets/images/hero-bg.jpg';
import './HeroSection.css';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <header className="hero-section">
      <div className="hero-section__bg">
        <img src={heroBg} alt="" className="hero-section__bg-img" />
        <div className="hero-section__bg-overlay" />
      </div>

      <div className="hero-section__content">
        <FadeInSection variant="fade-up" delay={0.2}>
          <span className="hero-section__overline">{t('heroOverline')}</span>
        </FadeInSection>

        <FadeInSection variant="fade-up" delay={0.4}>
          <h1 className="hero-section__title">
            {t('heroTitleLine1')} <br />
            <span className="hero-section__title-accent">{t('heroTitleLine2')}</span>
          </h1>
        </FadeInSection>

        <FadeInSection variant="fade-up" delay={0.6}>
          <p className="hero-section__subtitle">{t('heroSubtitle')}</p>
        </FadeInSection>

        <FadeInSection variant="fade-up" delay={0.8}>
          <div className="hero-section__actions">
            <Button
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('heroCta')}
            </Button>
            <Button
              variant="glass"
              size="lg"
              onClick={() => document.getElementById('practice')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('heroSecondaryCta')}
            </Button>
          </div>
        </FadeInSection>
      </div>

      <div className="hero-section__line" />
    </header>
  );
}
