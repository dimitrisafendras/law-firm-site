import { useTranslation } from '@/i18n';
import { FadeInSection, StaggerGroup } from '@/components/animations/FadeInSection';
import partnerMaleImg from '@/assets/images/partner-male.jpg';
import partnerFemaleImg from '@/assets/images/partner-female.jpg';
import partnerMaleAvif from '@/assets/images/partner-male.avif';
import partnerFemaleAvif from '@/assets/images/partner-female.avif';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { EditableText } from '@/components';
import './PartnerEthos.css';

interface Partner {
  /** 1-based, matching the `attorneyN*` translation keys. */
  n: 1 | 2 | 3;
  avif: string;
  fallback: string;
}

/*
 * PLACEHOLDER: no third headshot exists yet, so partner 3 reuses partner 1's
 * portrait. Two slots therefore point at the same file — when the real
 * photography arrives, both `avif`/`fallback` pairs below must be updated, not
 * just one.
 */
const partners: Partner[] = [
  { n: 1, avif: partnerMaleAvif, fallback: partnerMaleImg },
  { n: 2, avif: partnerFemaleAvif, fallback: partnerFemaleImg },
  { n: 3, avif: partnerMaleAvif, fallback: partnerMaleImg },
];

/**
 * The partners: three glass cards in one row.
 *
 * This was three alternating rows — portrait one side, a glass card the other,
 * mirrored on every second row. It cost 2,615px for three people and still
 * looked empty, because a ~780px portrait beside a ~450px top-aligned text
 * card leaves ~330px of dead page next to every photograph. Mirroring the
 * layout also mirrored the type, so one partner's biography was right-aligned
 * for no reason beyond symmetry.
 *
 * One row of three instead, each a single glass card with the portrait
 * bleeding to its top edge and the text below it. About 1,100px, no dead
 * column, nothing right-aligned.
 *
 * The portraits are in colour. They are the only photographs below the hero,
 * which makes them the page's only chromatic content — everything else down
 * here is type, glass and the ramp — and a `grayscale(1)` filter was throwing
 * that away for cohesion the layout already provides.
 */
export function PartnerEthos() {
  const { t } = useTranslation();

  return (
    <section id="team" className="partner-ethos">
      <div className="partner-ethos__inner">
        <FadeInSection>
          <SectionHeader titleKey="teamTitle" subtitleKey="teamSubtitle" labelKey="chapterTeam" />
        </FadeInSection>

        <StaggerGroup className="partner-ethos__plinth">
          {partners.map(({ n, avif, fallback }) => (
            <FadeInSection key={n}>
              <article className="partner-ethos__bust glass">
                <div className="partner-ethos__portrait">
                  <picture>
                    <source type="image/avif" srcSet={avif} />
                    <img
                      src={fallback}
                      alt={t(`attorney${n}Name`)}
                      className="partner-ethos__image"
                      width={512}
                      height={640}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <EditableText
                    tKey={`attorney${n}Title`}
                    as="span"
                    className="partner-ethos__badge"
                  />
                </div>

                <EditableText tKey={`attorney${n}Name`} as="h3" className="partner-ethos__name" />
                <p className="partner-ethos__role">
                  <EditableText tKey={`attorney${n}Spec1`} as="span" /> &amp;{' '}
                  <EditableText tKey={`attorney${n}Spec2`} as="span" />
                </p>
                <div className="partner-ethos__bio">
                  <EditableText tKey={`attorney${n}Bio`} as="p" />
                </div>

                <dl className="partner-ethos__meta">
                  <div className="partner-ethos__meta-item">
                    <EditableText tKey="teamFocusLabel" as="dt" className="partner-ethos__meta-label" />
                    <EditableText tKey={`attorney${n}Focus`} as="dd" className="partner-ethos__meta-value" />
                  </div>
                  <div className="partner-ethos__meta-item">
                    <EditableText tKey="teamOriginLabel" as="dt" className="partner-ethos__meta-label" />
                    <EditableText tKey={`attorney${n}Origin`} as="dd" className="partner-ethos__meta-value" />
                  </div>
                </dl>
              </article>
            </FadeInSection>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
