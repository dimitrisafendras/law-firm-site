import { useTranslation } from 'react-i18next';
import { FadeInSection, StaggerGroup } from '@/components/animations/FadeInSection';
import {
  RealEstateIcon,
  StartupFundingIcon,
  MaritimeIcon,
  CryptoIcon,
} from '@/assets/illustrations';
import './PracticeGrid.css';

const domains = [
  { key: 'RealEstate', icon: RealEstateIcon, span: 'wide', num: 'I' },
  { key: 'Startup', icon: StartupFundingIcon, span: 'narrow', num: 'II' },
  { key: 'Maritime', icon: MaritimeIcon, span: 'narrow', num: 'III' },
  { key: 'Crypto', icon: CryptoIcon, span: 'wide', num: 'IV' },
] as const;

export function PracticeGrid() {
  const { t } = useTranslation();

  return (
    <section id="practice" className="practice-section">
      <div className="practice-section__inner">
        <FadeInSection>
          <div className="practice-section__header">
            <div className="practice-section__header-text">
              <h2 className="practice-section__title">{t('practiceTitle')}</h2>
              <p className="practice-section__subtitle">{t('practiceSubtitle')}</p>
            </div>
            <span className="practice-section__label">Section 01 / Expertise</span>
          </div>
        </FadeInSection>

        <StaggerGroup className="practice-bento" interval={0.15}>
          {domains.map(({ key, icon: Icon, span, num }) => (
            <FadeInSection key={key} variant="fade-up" className={`practice-domain practice-domain--${span}`}>
              <div className="practice-domain__icon-bg">
                <Icon className="practice-domain__icon-large" />
              </div>
              <span className="practice-domain__num">Domain {num}</span>
              <h3 className="practice-domain__title">{t(`practice${key}Title`)}</h3>
              <p className="practice-domain__desc">{t(`practice${key}Desc`)}</p>
              <a className="practice-domain__link" href={`#practice-${key.toLowerCase()}`}>
                Explore Domain <span aria-hidden="true">&rarr;</span>
              </a>
            </FadeInSection>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
