import { useEffect } from 'react';
import type { JSX } from 'react';
import { useTranslation } from '@/i18n';
import { Navbar, Footer, Container, Card, EditableText, AuthNavControl } from '@/components';
import { VkmLogo } from '@/assets/VkmLogo';
import { CircuitField } from '@/components/CircuitField/CircuitField';
import type { PracticeArea } from '@/components/sections/PracticeGrid/practiceAreas';
import './PracticeDetailPage.css';

interface PracticeDetailPageProps {
  area: PracticeArea;
}

/**
 * One practice area, at `#practice/<slug>`.
 *
 * Title and short description are the same `practice<Key>*` keys the grid card
 * uses, so the card and this page can never disagree about a domain's name, and
 * an admin editing either one edits both. The fuller copy this page adds lives
 * under `…Detail` and `…Service1..4`.
 *
 * Same skeleton as the partner and auth pages — Navbar, a `.page-ramp` main
 * with the circuit field, Footer — so it stands on the site's ground rather
 * than beside it. `App` resolves the slug before rendering; a slug with no area
 * behind it never reaches this component.
 */
export default function PracticeDetailPage({ area }: PracticeDetailPageProps): JSX.Element {
  const { key, slug, icon: Icon, bg: Bg, num } = area;
  const { t } = useTranslation();

  /*
   * A hash the document has no element for leaves the scroll position exactly
   * where it was, so arriving from a card halfway down the home page would open
   * this one halfway down. Keyed on `slug` so moving between two areas resets
   * too.
   *
   * `behavior: 'instant'` rather than the default: index.css sets
   * `scroll-behavior: smooth` on the root for in-page anchors, and the default
   * `'auto'` defers to it — which would animate a page that has already been
   * replaced all the way up from wherever the practice section happened to be.
   */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [slug]);

  return (
    <>
      <Navbar
        logo={
          <a href="#" className="firm-logo" aria-label={t('firmName')}>
            <VkmLogo className="firm-logo__mark" />
            <span className="firm-logo__tagline">{t('firmTagline')}</span>
          </a>
        }
        links={[
          { label: t('navPractice'), href: '#practice' },
          { label: t('navTeam'), href: '#team' },
          { label: t('navTestimonials'), href: '#testimonials' },
          { label: t('navContact'), href: '#contact' },
        ]}
        cta={<AuthNavControl />}
      />

      <main className="practice-page page-ramp page-ramp--short">
        <CircuitField />

        <Container className="practice-page__inner">
          <a className="practice-page__back" href="#practice">
            <span aria-hidden="true">&#8592;</span>
            {t('practiceBackToAreas')}
          </a>

          <div className="practice-page__masthead">
            {/* The card's own illustration, at the size it was drawn for. On the
                card it is a masked corner engraving behind body copy; here it
                has a panel to itself, so it reads as the domain's mark. */}
            <Card as="figure" className="practice-page__art" aria-hidden="true">
              <Bg className="practice-page__art-drawing" />
              <Icon className="practice-page__art-mark" />
            </Card>

            <div className="practice-page__intro">
              <span className="practice-page__overline">
                <EditableText tKey="practiceAreaLabel" as="span" />
                <span className="practice-page__num">{t('practiceDomainNum', { num })}</span>
              </span>
              <EditableText tKey={`practice${key}Title`} as="h1" className="practice-page__title" />
              <EditableText tKey={`practice${key}Desc`} as="p" className="practice-page__lede" />

              <a className="practice-page__cta" href="#contact">
                {t('practiceContactCta')}
              </a>
            </div>
          </div>

          <div className="practice-page__panels">
            <Card as="section" className="practice-page__panel" aria-labelledby={`practice-overview-${slug}`}>
              <h2 className="practice-page__panel-title" id={`practice-overview-${slug}`}>
                {t('practiceOverviewLabel')}
              </h2>
              <EditableText
                tKey={`practice${key}Detail`}
                as="p"
                className="practice-page__detail"
              />
            </Card>

            <Card as="section" className="practice-page__panel" aria-labelledby={`practice-services-${slug}`}>
              <h2 className="practice-page__panel-title" id={`practice-services-${slug}`}>
                {t('practiceServicesLabel')}
              </h2>
              <ul className="practice-page__services">
                {([1, 2, 3, 4] as const).map((slot) => (
                  <li key={slot} className="practice-page__service">
                    <EditableText tKey={`practice${key}Service${slot}`} as="span" />
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </main>

      <Footer
        logo={
          <div className="footer-brand">
            <VkmLogo className="footer-brand__mark" title={t('firmName')} />
          </div>
        }
        columns={[]}
        bottom={<EditableText tKey="footerCopyright" as="p" />}
      />
    </>
  );
}
