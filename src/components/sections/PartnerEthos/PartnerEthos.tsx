import { useTranslation } from 'react-i18next';
import { FadeInSection } from '@/components/animations/FadeInSection';
import partnersImg from '@/assets/images/partners.jpg';
import './PartnerEthos.css';

export function PartnerEthos() {
  const { t } = useTranslation();

  return (
    <section id="team" className="partner-ethos">
      <div className="partner-ethos__inner">
        <div className="partner-ethos__grid">
          <FadeInSection variant="fade-left" className="partner-ethos__image-col">
            <div className="partner-ethos__image-wrapper">
              <img src={partnersImg} alt={`${t('attorney1Name')} & ${t('attorney2Name')}`} className="partner-ethos__image" />
            </div>
            <div className="partner-ethos__quote-card">
              <p className="partner-ethos__quote">
                &ldquo;{t('partnerQuote')}&rdquo;
              </p>
            </div>
          </FadeInSection>

          <FadeInSection variant="fade-right" delay={0.2} className="partner-ethos__text-col">
            <span className="partner-ethos__label">{t('teamOverline')}</span>
            <h2 className="partner-ethos__title">
              {t('partnerEthosLine1')} <br />
              <span className="partner-ethos__title-accent">{t('partnerEthosLine2')}</span>
            </h2>
            <p className="partner-ethos__desc">{t('teamSubtitle')}</p>

            <div className="partner-ethos__partners">
              <div className="partner-ethos__partner">
                <div className="partner-ethos__bar partner-ethos__bar--primary" />
                <div>
                  <h4 className="partner-ethos__partner-name">{t('attorney1Name')}</h4>
                  <p className="partner-ethos__partner-role">{t('attorney1Title')} | {t('attorney1Spec1')} & {t('attorney1Spec2')}</p>
                </div>
              </div>
              <div className="partner-ethos__partner">
                <div className="partner-ethos__bar partner-ethos__bar--accent" />
                <div>
                  <h4 className="partner-ethos__partner-name">{t('attorney2Name')}</h4>
                  <p className="partner-ethos__partner-role">{t('attorney2Title')} | {t('attorney2Spec1')} & {t('attorney2Spec2')}</p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
