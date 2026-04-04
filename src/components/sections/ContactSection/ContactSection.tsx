import { useTranslation } from 'react-i18next';
import { ContactForm } from '@/components/ContactForm';
import { FadeInSection } from '@/components/animations/FadeInSection';
import './ContactSection.css';

export function ContactSection() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="contact-section">
      <div className="contact-section__inner">
        <div className="contact-section__grid">
          <FadeInSection variant="fade-left" className="contact-section__info">
            <span className="contact-section__overline">{t('contactOverline')}</span>
            <h2 className="contact-section__title">{t('contactTitle')}</h2>
            <p className="contact-section__desc">{t('contactSubtitle')}</p>

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
