import { FadeInSection, StaggerGroup } from '@/components/animations/FadeInSection';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { PartnerCard } from './PartnerCard';
import { partners } from './partners';
import './PartnerEthos.css';

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
 *
 * The card itself lives in PartnerCard, because the design-system showcase
 * renders it too.
 */
export function PartnerEthos() {
  return (
    <section id="team" className="partner-ethos">
      <div className="partner-ethos__inner">
        <FadeInSection>
          <SectionHeader titleKey="teamTitle" subtitleKey="teamSubtitle" labelKey="chapterTeam" />
        </FadeInSection>

        <StaggerGroup className="partner-ethos__plinth">
          {partners.map((partner) => (
            <FadeInSection key={partner.n}>
              <PartnerCard partner={partner} />
            </FadeInSection>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
