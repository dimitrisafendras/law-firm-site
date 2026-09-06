import { useTranslation } from '@/i18n';
import { ContactForm } from '@/components/ContactForm';
import { EditableText } from '@/components';
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
            overlineKey="contactOverline"
            titleKey="contactTitle"
            subtitleKey="contactSubtitle"
            labelKey="chapterContact"
          />
        </FadeInSection>

        <div className="contact-section__grid">
          <FadeInSection className="contact-section__info">
            <div className="contact-section__details glass">
              <div className="contact-section__detail">
                <span className="contact-section__detail-icon" aria-hidden="true">&#9906;</span>
                <EditableText tKey="contactAddress" as="span" />
              </div>
              <div className="contact-section__detail">
                <span className="contact-section__detail-icon" aria-hidden="true">&#9993;</span>
                <EditableText
                  tKey="contactEmail"
                  as="a"
                  elementProps={{ href: `mailto:${t('contactEmail')}` }}
                />
              </div>
              <div className="contact-section__detail">
                <span className="contact-section__detail-icon" aria-hidden="true">&#9742;</span>
                <EditableText
                  tKey="contactPhone"
                  as="a"
                  elementProps={{ href: `tel:${t('contactPhone')}` }}
                />
              </div>
            </div>
          </FadeInSection>

          <FadeInSection step={1} className="contact-section__form">
            <ContactForm onSubmit={(data) => console.log('Form submitted:', data)} />
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
