import { useTranslation } from '@/i18n';
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
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { EditableText } from '@/components';
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
      <div className="practice-section__inner">
        <FadeInSection>
          <SectionHeader
            titleKey="practiceTitle"
            subtitleKey="practiceSubtitle"
            labelKey="chapterExpertise"
          />
        </FadeInSection>

        <StaggerGroup className="practice-bento">
          {domains.map(({ key, bg: Bg, num }) => (
            // Card lives inside the fade wrapper rather than on it: the wrapper
            // owns the entrance animation and the card owns its hover
            // transition, and a single element cannot hold both cleanly.
            <FadeInSection key={key}>
              <div className="practice-domain">
                <Bg className="practice-domain__bg" />
                <span className="practice-domain__num">{t('practiceDomainNum', { num })}</span>
                <EditableText tKey={`practice${key}Title`} as="h3" className="practice-domain__title" />
                <EditableText tKey={`practice${key}Desc`} as="p" className="practice-domain__desc" />
                <a className="practice-domain__link" href={`#practice-${key.toLowerCase()}`}>
                  {t('practiceExploreDomain')} <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </FadeInSection>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
