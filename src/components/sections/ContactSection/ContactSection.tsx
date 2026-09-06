import { ContactForm } from '@/components/ContactForm';
import { EditableText } from '@/components';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { EAST_MED_LAND, EAST_MED_VIEWBOX } from '@/assets/easternMediterranean';
import { useTranslation } from '@/i18n';
import { AddressPin } from './AddressPin';
import { CopyButton } from './CopyButton';
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

  /*
   * Google Maps' documented search URL, with the address as a query rather than
   * a lat/long pair. The address is admin-editable copy, so a coordinate baked
   * in here would go stale the moment the office moved and there would be
   * nothing on screen to show that it had; a query built from the same string
   * the row displays cannot disagree with it.
   */
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t('contactAddress'))}`;

  return (
    <section id="contact" className="contact-section">
      <div className="contact-section__band">
        <div className="contact-section__band-inner">
          {/* The header sits inside the band, not above it. It used to be in a
              separate container on the page ramp, which made the section read as
              a title followed by a picture; in here the title, the coastline and
              the form are one object. */}
          <FadeInSection>
            <SectionHeader
              titleKey="contactTitle"
              subtitleKey="contactSubtitle"
              labelKey="chapterContact"
            />
          </FadeInSection>

          <FadeInSection>
            <div className="contact-section__panel">
              <div className="contact-section__info glass">
                <EditableText tKey="contactDetailsLabel" as="span" className="contact-section__col-label" />

                {/*
                  Three rows, each with the same anatomy: a glyph, the value as
                  a link, and a copy control. The links each do the obvious
                  thing for their kind — the address opens Google Maps, the
                  email opens a compose window, the number dials — and the copy
                  button beside them is there because on a desktop none of those
                  three is what a person usually wants. Copying used to be the
                  map pin's job alone, which meant the only way to take the
                  email was to select it by hand.
                */}
                <div className="contact-section__details">
                  <div className="contact-section__detail">
                    <span className="contact-section__detail-icon" aria-hidden="true">&#9906;</span>
                    <EditableText
                      tKey="contactAddress"
                      as="a"
                      elementProps={{
                        href: mapsHref,
                        target: '_blank',
                        // `noopener` is the one that matters — it denies the
                        // opened tab a handle back to this window. `noreferrer`
                        // rides along because there is no reason to hand Maps
                        // the page a visitor came from.
                        rel: 'noopener noreferrer',
                        title: t('contactAddressMap'),
                      }}
                    />
                    <CopyButton value={t('contactAddress')} label={t('contactAddressLabel')} />
                  </div>
                  <div className="contact-section__detail">
                    <span className="contact-section__detail-icon" aria-hidden="true">&#9993;</span>
                    <EditableText
                      tKey="contactEmail"
                      as="a"
                      elementProps={{ href: `mailto:${t('contactEmail')}` }}
                    />
                    <CopyButton value={t('contactEmail')} label={t('contactEmailLabel')} />
                  </div>
                  <div className="contact-section__detail">
                    <span className="contact-section__detail-icon" aria-hidden="true">&#9742;</span>
                    <EditableText
                      tKey="contactPhone"
                      as="a"
                      elementProps={{ href: `tel:${t('contactPhone')}` }}
                    />
                    <CopyButton value={t('contactPhone')} label={t('contactPhoneLabel')} />
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

              {/*
                * The form column, and the map's frame.
                *
                * The map used to be a child of the band, spanning its whole
                * width. It belongs to this column now: it is the ground the
                * form sits on, not a backdrop for the section.
                *
                * Everything about the placement follows from one property of
                * the artwork — the viewBox is centred on Athens, and the centre
                * of a viewBox is the one point a symmetric `slice` crop leaves
                * alone (see easternMediterranean.ts). So Athens is at the exact
                * centre of this frame whatever size the frame ends up, and the
                * pin is placed at 50%/50% rather than solved against a stack of
                * measured constants. The frame's height may vary with the
                * form's; the centre cannot move.
                */}
              <div className="contact-section__form-col">
                <div className="contact-section__map-frame">
                  <svg
                    className="contact-section__map"
                    viewBox={EAST_MED_VIEWBOX}
                    preserveAspectRatio="xMidYMid slice"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path className="contact-section__land" d={EAST_MED_LAND} />
                  </svg>

                  {/* The pin is HTML, not part of the SVG above — it is a
                      control now. See AddressPin.tsx. */}
                  <AddressPin />
                </div>

                <div className="contact-section__form">
                  <EditableText tKey="contactFormLabel" as="span" className="contact-section__col-label" />
                  <ContactForm onSubmit={(data) => console.log('Form submitted:', data)} />
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
