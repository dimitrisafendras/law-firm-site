import { useTranslation } from 'react-i18next';
import { FadeInSection, StaggerGroup } from '@/components/animations/FadeInSection';
import worldMapImg from '@/assets/images/world-map.jpg';
import { CircuitLines } from '@/components/CircuitLines/CircuitLines';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import './NetworkMap.css';

const nodes = [
  {
    key: 'Athens',
    code: 'ATH',
    labelKey: 'networkAthensLabel',
    cityKey: 'networkAthensCity',
    items: ['networkAthensItem1', 'networkAthensItem2', 'networkAthensItem3'],
  },
  {
    key: 'Piraeus',
    code: 'PIR',
    labelKey: 'networkPiraeusLabel',
    cityKey: 'networkPiraeusCity',
    items: ['networkPiraeusItem1', 'networkPiraeusItem2', 'networkPiraeusItem3'],
  },
  {
    key: 'Digital',
    code: 'DEC',
    labelKey: 'networkDigitalLabel',
    cityKey: 'networkDigitalCity',
    items: ['networkDigitalItem1', 'networkDigitalItem2', 'networkDigitalItem3'],
  },
] as const;

export function NetworkMap() {
  const { t } = useTranslation();

  return (
    <section className="network-map">
      <CircuitLines variant="f" />
      <div className="network-map__inner">
        <FadeInSection>
          <SectionHeader
            overline={t('networkOverline')}
            title={t('networkTitle')}
            subtitle={t('networkSubtitle')}
            label="Section 03 / Network"
          />
        </FadeInSection>

        <div className="network-map__grid">
          <StaggerGroup className="network-map__cards" interval={0.15}>
            {nodes.map(({ key, code, labelKey, cityKey, items }) => (
              <FadeInSection key={key} variant="fade-up" className="network-map__card">
                <span className="network-map__card-code" aria-hidden="true">{code}</span>
                <span className="network-map__card-label">{t(labelKey)}</span>
                <h3 className="network-map__card-city">{t(cityKey)}</h3>
                <ul className="network-map__card-list">
                  {items.map((itemKey) => (
                    <li key={itemKey}>{t(itemKey)}</li>
                  ))}
                </ul>
                <a className="network-map__card-link" href="#contact">
                  {t('networkConnectNode')} <span aria-hidden="true">&rarr;</span>
                </a>
              </FadeInSection>
            ))}
          </StaggerGroup>

          <FadeInSection variant="fade-right" delay={0.2} className="network-map__map-col">
            <div className="network-map__map">
              <img
                src={worldMapImg}
                alt=""
                className="network-map__map-img"
              />
              <div className="network-map__map-glow" />
              <div className="network-map__pin">
                <span className="network-map__pin-label">Athens</span>
                <svg className="network-map__pin-icon" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path fill="var(--accent)" d="M256,0C160.798,0,83.644,77.155,83.644,172.356c0,97.162,48.158,117.862,101.386,182.495
                    C248.696,432.161,256,512,256,512s7.304-79.839,70.97-157.148c53.228-64.634,101.386-85.334,101.386-182.495
                    C428.356,77.155,351.202,0,256,0z M256,231.921c-32.897,0-59.564-26.668-59.564-59.564s26.668-59.564,59.564-59.564
                    c32.896,0,59.564,26.668,59.564,59.564S288.896,231.921,256,231.921z"/>
                </svg>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
