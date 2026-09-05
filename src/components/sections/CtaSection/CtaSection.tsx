import { useTranslation } from '@/i18n';
import { Button } from '@/components/Button';
import { EditableText } from '@/components';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { DigitalAcropolis } from '@/assets/illustrations';
import { CircuitLines } from '@/components/CircuitLines/CircuitLines';
import './CtaSection.css';

export function CtaSection() {
  const { t } = useTranslation();

  return (
    <section className="cta-section">
      <CircuitLines variant="e" />
      <div className="cta-section__inner">
        <FadeInSection variant="scale">
          <div className="cta-section__card glass">
            <div className="cta-section__glow" />
            <DigitalAcropolis className="cta-section__illustration" />
            <div className="cta-section__content">
              <EditableText tKey="ctaTitle" as="h2" className="cta-section__title" />
              <EditableText tKey="ctaSubtitle" as="p" className="cta-section__desc" />
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
