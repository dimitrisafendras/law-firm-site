import { useTranslation } from 'react-i18next';
import { FadeInSection } from '@/components/animations/FadeInSection';
import partnerMaleImg from '@/assets/images/partner-male.jpg';
import partnerFemaleImg from '@/assets/images/partner-female.jpg';
import { CircuitLines } from '@/components/CircuitLines/CircuitLines';
import './PartnerEthos.css';

export function PartnerEthos() {
  const { t } = useTranslation();

  return (
    <section id="team" className="partner-ethos">
      <CircuitLines variant="a" />
      <div className="partner-ethos__inner">
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
                <span className="partner-ethos__badge partner-ethos__badge--left">
                  {t('attorney1Title')}
                </span>
              </div>
            </FadeInSection>

            <FadeInSection variant="fade-right" delay={0.15} className="partner-ethos__text-col">
              <h3 className="partner-ethos__name">{t('attorney1Name')}</h3>
              <p className="partner-ethos__role">
                {t('attorney1Spec1')} &amp; {t('attorney1Spec2')}
              </p>
              <div className="partner-ethos__bio">
                <p>{t('attorney1Bio')}</p>
              </div>
              <div className="partner-ethos__meta">
                <div className="partner-ethos__meta-item">
                  <span className="partner-ethos__meta-label">{t('teamFocusLabel')}</span>
                  <span className="partner-ethos__meta-value">{t('attorney1Focus')}</span>
                </div>
                <div className="partner-ethos__meta-item">
                  <span className="partner-ethos__meta-label">{t('teamOriginLabel')}</span>
                  <span className="partner-ethos__meta-value">{t('attorney1Origin')}</span>
                </div>
              </div>
            </FadeInSection>
          </div>

          {/* Partner 2 — text left (right-aligned), image right */}
          <div className="partner-ethos__row partner-ethos__row--reversed">
            <FadeInSection variant="fade-left" delay={0.15} className="partner-ethos__text-col partner-ethos__text-col--right">
              <h3 className="partner-ethos__name">{t('attorney2Name')}</h3>
              <p className="partner-ethos__role">
                {t('attorney2Spec1')} &amp; {t('attorney2Spec2')}
              </p>
              <div className="partner-ethos__bio">
                <p>{t('attorney2Bio')}</p>
              </div>
              <div className="partner-ethos__meta partner-ethos__meta--right">
                <div className="partner-ethos__meta-item">
                  <span className="partner-ethos__meta-label">{t('teamFocusLabel')}</span>
                  <span className="partner-ethos__meta-value">{t('attorney2Focus')}</span>
                </div>
                <div className="partner-ethos__meta-item">
                  <span className="partner-ethos__meta-label">{t('teamOriginLabel')}</span>
                  <span className="partner-ethos__meta-value">{t('attorney2Origin')}</span>
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
                <span className="partner-ethos__badge partner-ethos__badge--right">
                  {t('attorney2Title')}
                </span>
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
    </section>
  );
}
