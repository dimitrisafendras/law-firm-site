import { useTranslation } from 'react-i18next';
import { FadeInSection } from '@/components/animations/FadeInSection';
import partnerMaleImg from '@/assets/images/partner-male.jpg';
import partnerFemaleImg from '@/assets/images/partner-female.jpg';
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
                <img
                  src={partnerMaleImg}
                  alt={t('attorney1Name')}
                  className="partner-ethos__image"
                />
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
                {t('attorney1Spec1')} &amp; {t('attorney1Spec2')}
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
                {t('attorney2Spec1')} &amp; {t('attorney2Spec2')}
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
                <img
                  src={partnerFemaleImg}
                  alt={t('attorney2Name')}
                  className="partner-ethos__image"
                />
                <div className="partner-ethos__image-overlay" />
                <EditableText
                  tKey="attorney2Title"
                  as="span"
                  className="partner-ethos__badge partner-ethos__badge--right"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
    </section>
  );
}
