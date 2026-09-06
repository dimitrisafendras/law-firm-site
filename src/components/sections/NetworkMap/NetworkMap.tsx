import { useTranslation } from '@/i18n';
import { EditableText } from '@/components';
import { FadeInSection, StaggerGroup } from '@/components/animations/FadeInSection';
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

/**
 * Presence — a photographic band with the locations as glass over it.
 *
 * This was a dotted world map with a single pin on Athens, beside three cards
 * stretched to the map's height and about 40% empty as a result. The map was
 * the most template-derived element on the page and it contradicted its own
 * headline: a world map illustrating two offices ten kilometres apart.
 *
 * The band is the site's lensing showcase. The one place the glass material
 * has ever unambiguously worked is the mobile menu over the statue, where real
 * blur and saturation turn marble and cyan into colour; everywhere else it
 * floats over a flat dark ramp with nothing to concentrate. Here the cards sit
 * on a photograph, which is the condition the material was designed for.
 *
 * PLACEHOLDER: the band renders a solid tonal ground until the client supplies
 * photography — Athens from Lycabettus, the Piraeus container terminal. Set it
 * on `--band-image` in NetworkMap.css; nothing else needs to change.
 */
export function NetworkMap() {
  const { t } = useTranslation();

  return (
    <section className="network-map">
      <div className="network-map__inner">
        <FadeInSection>
          <SectionHeader
            titleKey="networkTitle"
            subtitleKey="networkSubtitle"
            labelKey="chapterNetwork"
          />
        </FadeInSection>
      </div>

      <div className="network-map__band">
        <div className="network-map__band-inner">
          <StaggerGroup className="network-map__cards">
            {nodes.map(({ key, code, labelKey, cityKey, items }) => (
              // Card nested inside the fade wrapper: .network-map__card has its
              // own hover `transition`, which would override the wrapper's
              // entrance animation if both lived on one element.
              <FadeInSection key={key}>
                <div className="network-map__card glass glass--interactive" data-variant="clear">
                  <span className="network-map__card-code" aria-hidden="true">{code}</span>
                  <EditableText tKey={labelKey} as="span" className="network-map__card-label" />
                  <EditableText tKey={cityKey} as="h3" className="network-map__card-city" />
                  <ul className="network-map__card-list">
                    {items.map((itemKey) => (
                      <EditableText key={itemKey} tKey={itemKey} as="li" />
                    ))}
                  </ul>
                  <a className="network-map__card-link" href="#contact">
                    {t('networkConnectNode')} <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </FadeInSection>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
