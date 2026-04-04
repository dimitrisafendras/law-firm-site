import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';
import { FadeInSection } from '@/components/animations/FadeInSection';
import './CtaSection.css';

export function CtaSection() {
  const { t } = useTranslation();

  return (
    <section className="cta-section">
      <div className="cta-section__inner">
        <FadeInSection variant="scale">
          <div className="cta-section__card">
            <div className="cta-section__glow" />
            <div className="cta-section__content">
              <h2 className="cta-section__title">{t('ctaTitle')}</h2>
              <p className="cta-section__desc">{t('ctaSubtitle')}</p>
              <Button
                size="lg"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('ctaButton')}
              </Button>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
