import { useTranslation } from '@/i18n';
import { FadeInSection } from '@/components/animations/FadeInSection';
import partnerMaleImg from '@/assets/images/partner-male.jpg';
import partnerFemaleImg from '@/assets/images/partner-female.jpg';
import partnerMaleAvif from '@/assets/images/partner-male.avif';
import partnerFemaleAvif from '@/assets/images/partner-female.avif';
// PLACEHOLDER: no third headshot exists yet, and partners.jpg is a two-person
// group shot. Reuses partner 1's portrait so the row renders; swap in a real
// photo of the crypto partner.
const partnerCryptoAvif = partnerMaleAvif;
import { CircuitLines } from '@/components/CircuitLines/CircuitLines';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { EditableText } from '@/components';
import './PartnerEthos.css';

export function PartnerEthos() {
  const { t } = useTranslation();

  return (
    <section id="team" className="partner-ethos">
      <CircuitLines variant="a" />
      <div className="partner-ethos__inner">
        <FadeInSection variant="fade-up">
          <SectionHeader
            overlineKey="teamOverline"
            titleKey="teamTitle"
            subtitleKey="teamSubtitle"
            labelKey="chapterTeam"
          />
        </FadeInSection>

        <div className="partner-ethos__profiles">
          {/* Partner 1 — image left, text right */}
          <div className="partner-ethos__row">
            <FadeInSection variant="fade-left" className="partner-ethos__image-col">
              <div className="partner-ethos__image-wrapper">
                <picture>
                  <source type="image/avif" srcSet={partnerMaleAvif} />
                  <img
                    src={partnerMaleImg}
                    alt={t('attorney1Name')}
                    className="partner-ethos__image"
                    width={512}
                    height={512}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <div className="partner-ethos__image-overlay" />
                <EditableText
                  tKey="attorney1Title"
                  as="span"
                  className="partner-ethos__badge partner-ethos__badge--left"
                />
              </div>
            </FadeInSection>

            <FadeInSection variant="fade-right" delay={0.15} className="partner-ethos__text-col">
              <EditableText tKey="attorney1Name" as="h3" className="partner-ethos__name" />
              <p className="partner-ethos__role">
                <EditableText tKey="attorney1Spec1" as="span" /> &amp;{' '}
                <EditableText tKey="attorney1Spec2" as="span" />
              </p>
              <div className="partner-ethos__bio">
                <EditableText tKey="attorney1Bio" as="p" />
              </div>
              <div className="partner-ethos__meta">
                <div className="partner-ethos__meta-item">
                  <EditableText tKey="teamFocusLabel" as="span" className="partner-ethos__meta-label" />
                  <EditableText tKey="attorney1Focus" as="span" className="partner-ethos__meta-value" />
                </div>
                <div className="partner-ethos__meta-item">
                  <EditableText tKey="teamOriginLabel" as="span" className="partner-ethos__meta-label" />
                  <EditableText tKey="attorney1Origin" as="span" className="partner-ethos__meta-value" />
                </div>
              </div>
            </FadeInSection>
          </div>

          {/* Partner 2 — text left (right-aligned), image right */}
          <div className="partner-ethos__row partner-ethos__row--reversed">
            <FadeInSection variant="fade-left" delay={0.15} className="partner-ethos__text-col partner-ethos__text-col--right">
              <EditableText tKey="attorney2Name" as="h3" className="partner-ethos__name" />
              <p className="partner-ethos__role">
                <EditableText tKey="attorney2Spec1" as="span" /> &amp;{' '}
                <EditableText tKey="attorney2Spec2" as="span" />
              </p>
              <div className="partner-ethos__bio">
                <EditableText tKey="attorney2Bio" as="p" />
              </div>
              <div className="partner-ethos__meta partner-ethos__meta--right">
                <div className="partner-ethos__meta-item">
                  <EditableText tKey="teamFocusLabel" as="span" className="partner-ethos__meta-label" />
                  <EditableText tKey="attorney2Focus" as="span" className="partner-ethos__meta-value" />
                </div>
                <div className="partner-ethos__meta-item">
                  <EditableText tKey="teamOriginLabel" as="span" className="partner-ethos__meta-label" />
                  <EditableText tKey="attorney2Origin" as="span" className="partner-ethos__meta-value" />
                </div>
              </div>
            </FadeInSection>

            <FadeInSection variant="fade-right" className="partner-ethos__image-col">
              <div className="partner-ethos__image-wrapper">
                <picture>
                  <source type="image/avif" srcSet={partnerFemaleAvif} />
                  <img
                    src={partnerFemaleImg}
                    alt={t('attorney2Name')}
                    className="partner-ethos__image"
                    width={512}
                    height={512}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <div className="partner-ethos__image-overlay" />
                <EditableText
                  tKey="attorney2Title"
                  as="span"
                  className="partner-ethos__badge partner-ethos__badge--right"
                />
              </div>
            </FadeInSection>
          </div>

          {/* Partner 3 — image left, text right */}
          <div className="partner-ethos__row">
            <FadeInSection variant="fade-left" className="partner-ethos__image-col">
              <div className="partner-ethos__image-wrapper">
                <img
                  src={partnerCryptoAvif}
                  alt={t('attorney3Name')}
                  className="partner-ethos__image"
                />
                <div className="partner-ethos__image-overlay" />
                <EditableText
                  tKey="attorney3Title"
                  as="span"
                  className="partner-ethos__badge partner-ethos__badge--left"
                />
              </div>
            </FadeInSection>

            <FadeInSection variant="fade-right" delay={0.15} className="partner-ethos__text-col">
              <EditableText tKey="attorney3Name" as="h3" className="partner-ethos__name" />
              <p className="partner-ethos__role">
                <EditableText tKey="attorney3Spec1" as="span" /> &amp;{' '}
                <EditableText tKey="attorney3Spec2" as="span" />
              </p>
              <div className="partner-ethos__bio">
                <EditableText tKey="attorney3Bio" as="p" />
              </div>
              <div className="partner-ethos__meta">
                <div className="partner-ethos__meta-item">
                  <EditableText tKey="teamFocusLabel" as="span" className="partner-ethos__meta-label" />
                  <EditableText tKey="attorney3Focus" as="span" className="partner-ethos__meta-value" />
                </div>
                <div className="partner-ethos__meta-item">
                  <EditableText tKey="teamOriginLabel" as="span" className="partner-ethos__meta-label" />
                  <EditableText tKey="attorney3Origin" as="span" className="partner-ethos__meta-value" />
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
    </section>
  );
}
