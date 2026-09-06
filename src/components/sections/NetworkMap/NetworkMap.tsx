import { useTranslation } from '@/i18n';
import { EditableText } from '@/components';
import { FadeInSection, StaggerGroup } from '@/components/animations/FadeInSection';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { EAST_MED_LAND, EAST_MED_VIEWBOX, ATHENS_PIRAEUS } from '@/assets/easternMediterranean';
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
 * Presence — a regional map, with the locations as glass over it.
 *
 * This was a dotted world map carrying a single pin on Athens, beside three
 * cards stretched to the map's height and about 40% empty as a result. The
 * problem was not the map, it was the span: a world map illustrating two
 * offices ten kilometres apart is a headline contradicting its own picture.
 *
 * Cropped to the Eastern Mediterranean, the same picture becomes true — it
 * shows the sea the maritime practice actually works on, the Aegean the
 * shipping corridor runs through, and the EU coastline the real-estate and
 * venture work sits inside. Athens and Piraeus are 2.4px apart at this scale,
 * so they are one honest pin rather than two.
 *
 * The map is also where the glass finally gets to do its job on desktop. The
 * one place the material has ever unambiguously worked is the mobile menu over
 * the statue; everywhere else it floats over a flat ramp with nothing to
 * concentrate. Here the cards sit over drawn coastline.
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
        <svg
          className="network-map__map"
          viewBox={EAST_MED_VIEWBOX}
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
          focusable="false"
        >
          <path className="network-map__land" d={EAST_MED_LAND} />
          <g className="network-map__pin" transform={`translate(${ATHENS_PIRAEUS.x} ${ATHENS_PIRAEUS.y})`}>
            <circle className="network-map__pin-halo" r="26" />
            <circle className="network-map__pin-dot" r="4.5" />
          </g>
        </svg>

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
