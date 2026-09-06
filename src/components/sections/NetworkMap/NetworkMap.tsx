import { useTranslation } from '@/i18n';
import { useEditMode } from '@/lib/edit-mode';
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
  // The whole card is a click target (see the stretched link in the CSS), and
  // the overlay that makes it one sits above the card's copy — which is exactly
  // the copy an admin has to be able to click to edit. So the overlay is turned
  // off while editing is unlocked; for every visitor it is always on.
  const { canEdit } = useEditMode();

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
        {/* Mid/Mid, not YMax. The viewBox is centred on Athens (see
            easternMediterranean.ts), and the centre is the only point a
            symmetric `slice` crop leaves put — so she lands at the centre of
            this SVG's box at every viewport width instead of drifting up to the
            top edge as the viewport gets wider. The box is then offset above the
            band in CSS so that centre is not behind the cards. */}
        <svg
          className="network-map__map"
          viewBox={EAST_MED_VIEWBOX}
          preserveAspectRatio="xMidYMid slice"
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
                <div
                  className="network-map__card glass glass--interactive"
                  data-variant="clear"
                  data-editing={canEdit ? '' : undefined}
                >
                  <span className="network-map__card-code" aria-hidden="true">{code}</span>
                  <EditableText tKey={labelKey} as="span" className="network-map__card-label" />
                  <EditableText tKey={cityKey} as="h3" className="network-map__card-city" />
                  <ul className="network-map__card-list">
                    {items.map((itemKey) => (
                      <EditableText key={itemKey} tKey={itemKey} as="li" />
                    ))}
                  </ul>
                  {/* The card's only interactive element, and the whole card's
                      hit area: its ::after is stretched over the card in CSS.
                      Nothing is nested inside it and nothing else is focusable,
                      so the card exposes exactly one tab stop with one name —
                      and the name has to say *which* node it connects, because
                      three cards reading "Connect Node" is three identical
                      links in a screen reader's link list. */}
                  <a
                    className="network-map__card-link"
                    href="#contact"
                    aria-label={`${t('networkConnectNode')} — ${t(cityKey)}`}
                  >
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
