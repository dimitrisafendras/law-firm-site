import { useTranslation } from 'react-i18next';
import { FadeInSection, StaggerGroup } from '@/components/animations/FadeInSection';
import worldMapImg from '@/assets/images/world-map.jpg';
import { CircuitLines } from '@/components/CircuitLines/CircuitLines';
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
          <div className="network-map__header">
            <h2 className="network-map__title">{t('networkTitle')}</h2>
            <p className="network-map__subtitle">{t('networkSubtitle')}</p>
          </div>
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
                <svg className="network-map__pin-icon" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z" fill="var(--accent)" />
                  <circle cx="12" cy="12" r="5" fill="var(--bg)" />
                </svg>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
