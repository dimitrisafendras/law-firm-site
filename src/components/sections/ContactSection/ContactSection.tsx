import { useTranslation } from 'react-i18next';
import { ContactForm } from '@/components/ContactForm';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { CircuitLines } from '@/components/CircuitLines/CircuitLines';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import './ContactSection.css';

export function ContactSection() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="contact-section">
      <CircuitLines variant="b" />
      <div className="contact-section__inner">
        <FadeInSection>
          <SectionHeader
            overline={t('contactOverline')}
            title={t('contactTitle')}
            subtitle={t('contactSubtitle')}
            label="Section 05 / Contact"
          />
        </FadeInSection>

        <div className="contact-section__grid">
          <FadeInSection variant="fade-left" className="contact-section__info">
            <div className="contact-section__details">
              <div className="contact-section__detail">
                <span className="contact-section__detail-icon" aria-hidden="true">&#9906;</span>
                <span>{t('contactAddress')}</span>
              </div>
              <div className="contact-section__detail">
                <span className="contact-section__detail-icon" aria-hidden="true">&#9993;</span>
                <a href={`mailto:${t('contactEmail')}`}>{t('contactEmail')}</a>
              </div>
              <div className="contact-section__detail">
                <span className="contact-section__detail-icon" aria-hidden="true">&#9742;</span>
                <a href={`tel:${t('contactPhone')}`}>{t('contactPhone')}</a>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection variant="fade-right" delay={0.2} className="contact-section__form">
            <ContactForm onSubmit={(data) => console.log('Form submitted:', data)} />
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
