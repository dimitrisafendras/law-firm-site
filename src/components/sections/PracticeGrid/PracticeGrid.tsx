import { useTranslation } from 'react-i18next';
import { FadeInSection, StaggerGroup } from '@/components/animations/FadeInSection';
import {
  RealEstateIcon,
  StartupFundingIcon,
  MaritimeIcon,
  CryptoIcon,
} from '@/assets/illustrations';
import {
  RealEstateBg,
  StartupBg,
  MaritimeBg,
  CryptoBg,
} from '@/assets/domainBackgrounds';
import { CircuitLines } from '@/components/CircuitLines/CircuitLines';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import './PracticeGrid.css';

import type { ComponentType } from 'react';

const domains: {
  key: string;
  icon: ComponentType<{ className?: string }>;
  bg: ComponentType<{ className?: string }>;
  num: string;
}[] = [
  { key: 'RealEstate', icon: RealEstateIcon, bg: RealEstateBg, num: 'I' },
  { key: 'Startup', icon: StartupFundingIcon, bg: StartupBg, num: 'II' },
  { key: 'Maritime', icon: MaritimeIcon, bg: MaritimeBg, num: 'III' },
  { key: 'Crypto', icon: CryptoIcon, bg: CryptoBg, num: 'IV' },
];

export function PracticeGrid() {
  const { t } = useTranslation();

  return (
    <section id="practice" className="practice-section">
      <CircuitLines variant="a" />
      <div className="practice-section__inner">
        <FadeInSection>
          <SectionHeader
            overline={t('practiceOverline')}
            title={t('practiceTitle')}
            subtitle={t('practiceSubtitle')}
            label="Chapter 01 / Expertise"
          />
        </FadeInSection>

        <StaggerGroup className="practice-bento" interval={0.15}>
          {domains.map(({ key, bg: Bg, num }) => (
            <FadeInSection key={key} variant="fade-up" className="practice-domain">
              <Bg className="practice-domain__bg" />
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
