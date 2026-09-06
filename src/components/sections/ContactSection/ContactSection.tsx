import { useTranslation } from '@/i18n';
import { ContactForm } from '@/components/ContactForm';
import { EditableText } from '@/components';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import './ContactSection.css';

export function ContactSection() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="contact-section">
      <div className="contact-section__inner">
        <FadeInSection>
          <SectionHeader
            titleKey="contactTitle"
            subtitleKey="contactSubtitle"
            labelKey="chapterContact"
          />
        </FadeInSection>

        <div className="contact-section__grid">
          <FadeInSection className="contact-section__info">
            {/*
              No glass card. The details are three short lines, and wrapping
              them in a panel left a ~200px surface floating at the top of a
              ~700px column with nothing under it — the emptiest place on the
              page. Set directly on the ground, at a size that can hold the
              column on its own, they read as the address block on a letterhead
              rather than as a widget that failed to fill its slot.
            */}
            <div className="contact-section__details">
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
