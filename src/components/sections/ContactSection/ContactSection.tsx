import { ContactForm } from '@/components/ContactForm';
import { EditableText } from '@/components';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { EAST_MED_LAND, EAST_MED_VIEWBOX } from '@/assets/easternMediterranean';
import { useTranslation } from '@/i18n';
import { AddressPin } from './AddressPin';
import './ContactSection.css';

/**
 * Contact — the map is the section, and the form sits on it as glass.
 *
 * This is two sections merged. "Global Network" was a regional map carrying
 * three glass node cards: Athens, Piraeus, and "Decentralized". The map had
 * already been cropped from a world view to the Eastern Mediterranean because a
 * world map illustrating two offices ten kilometres apart is a headline
 * contradicting its own picture — but the three nodes were the same untruth one
 * level down. There is one firm, one office, and a partner who works the
 * shipping side out of Piraeus; a network diagram of that is a diagram of one
 * point, which is what the single pin always was.
 *
 * So the fiction goes and the composition stays. The band, the coastline and
 * the pin are the ones the previous section spent its effort getting right; the
 * form takes the place the node cards had, low in the band where the scrim is
 * heaviest, and the section keeps `id="contact"` so every anchor on the site
 * still lands here.
 *
 * The nine practice bullets the node cards listed are gone. They were the four
 * practice areas of #practice restated as three columns of three, and the one
 * fact in them that #practice does not already carry — that the maritime work
 * runs out of Piraeus — is now a sentence beside the address, where a person
 * looking for an office actually reads it.
 */
export function ContactSection() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="contact-section">
      {/*
       * No `content-visibility: auto` (it used to be here). The band below owns
       * an opaque background, and paint containment on a section that paints
       * its own ground leaves a hole in the page while the section is skipped —
       * same reason as StatsBar and the marble plinth.
       */}
      <div className="contact-section__inner">
        <FadeInSection>
          <SectionHeader
            titleKey="contactTitle"
            subtitleKey="contactSubtitle"
            labelKey="chapterContact"
          />
        </FadeInSection>
      </div>

      <div className="contact-section__band">
        {/* Mid/Mid, not YMax. The viewBox is centred on Athens (see
            easternMediterranean.ts), and the centre is the only point a
            symmetric `slice` crop leaves put — so she lands at the centre of
            this SVG's box at every viewport width instead of drifting as the
            viewport gets wider. The box is then offset above the band in CSS so
            that centre lands on `--pin-y`, clear of the panel. */}
        <svg
          className="contact-section__map"
          viewBox={EAST_MED_VIEWBOX}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          focusable="false"
        >
          <path className="contact-section__land" d={EAST_MED_LAND} />
        </svg>

        {/* The pin is HTML, not part of the SVG above — it is a control now.
            See AddressPin.tsx. */}
        <AddressPin />

        <div className="contact-section__band-inner">
          <FadeInSection>
            <div className="contact-section__panel glass">
              <div className="contact-section__info">
                <EditableText tKey="contactDetailsLabel" as="span" className="contact-section__col-label" />

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

                {/* The one thing worth keeping from the three node cards: which
                    half of the practice sits where. */}
                <EditableText tKey="contactOfficeNote" as="p" className="contact-section__office-note" />

                {/*
                  What a first consultation actually involves — response time,
                  what the call covers, and that it is privileged. This is the
                  part a person deciding whether to make contact wants to know,
                  and it is what fills the column opposite the form.
                */}
                <dl className="contact-section__promises">
                  <div className="contact-section__promise">
                    <EditableText tKey="contactPromise1Label" as="dt" />
                    <EditableText tKey="contactPromise1Value" as="dd" />
                  </div>
                  <div className="contact-section__promise">
                    <EditableText tKey="contactPromise2Label" as="dt" />
                    <EditableText tKey="contactPromise2Value" as="dd" />
                  </div>
                  <div className="contact-section__promise">
                    <EditableText tKey="contactPromise3Label" as="dt" />
                    <EditableText tKey="contactPromise3Value" as="dd" />
                  </div>
                </dl>
              </div>

              <div className="contact-section__form">
                <EditableText tKey="contactFormLabel" as="span" className="contact-section__col-label" />
                <ContactForm onSubmit={(data) => console.log('Form submitted:', data)} />
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
