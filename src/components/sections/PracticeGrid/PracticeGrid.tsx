import { FadeInSection, StaggerGroup } from '@/components/animations/FadeInSection';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { PracticeDomainCard } from './PracticeDomainCard';
import { practiceAreas } from './practiceAreas';
import './PracticeGrid.css';

export function PracticeGrid() {
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
          {practiceAreas.map((area) => (
            // Card lives inside the fade wrapper rather than on it: the wrapper
            // owns the entrance animation and the card owns its hover
            // transition, and a single element cannot hold both cleanly.
            <FadeInSection key={area.key}>
              <PracticeDomainCard area={area} />
            </FadeInSection>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
