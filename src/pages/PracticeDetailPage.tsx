import { useEffect } from 'react';
import type { JSX } from 'react';
import { useTranslation } from '@/i18n';
import { Navbar, Container, Card, EditableText, AuthNavControl } from '@/components';
import { VkmLogo } from '@/assets/VkmLogo';
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
 * under `…Detail` and `…Service1..5`.
 *
 * Same ground as the partner and auth pages — Navbar over a `.page-ramp` main
 * with the circuit field — so it stands on the site's ground rather than beside
 * it. No footer: this page is one domain with a way back to the practice
 * section at the top of it, and a full sitemap under a single area is a second
 * navigation for a page that has exactly one destination. `App` resolves the
 * slug before rendering; a slug with no area behind it never reaches this
 * component.
 *
 * ─── The composition, and why it is this one ────────────────────────────────
 *
 * Four regions, and the partner page is built from the same four under the same
 * names — see PracticeDetailPage.css for the shared measurements:
 *
 *   rail      one line: the way back on the left, the page's index on the right
 *   identity  h1 with the lede beside the call to action
 *   panels    prose on the left, a numbered ledger on the right
 *
 * Where there is room (the gate in the stylesheet) those four hold one screen
 * with no page scroll, and the plate and both panels end on one bottom edge.
 * Below the gate it is an ordinary scrolling document again.
 *
 * Two things about it are worth knowing before changing anything. Every surface
 * is sized by its own content — the panels are as tall as what they hold and
 * the ledger's rhythm is a fixed step of the scale — and whatever height is left
 * over is ground around the composition, not padding inside the cards. And the
 * five services are a numbered ledger rather than the bulleted column they were,
 * because an index and a rule turn five clauses into a set that can be scanned
 * instead of five lines of the same accent blue; the partner page's three
 * specialisations, pills before, are now the same object.
 *
 * ─── Where the domain's drawing went ────────────────────────────────────────
 *
 * It used to have a glass plate of its own, in the first column of the stage.
 * That plate was the page's largest object and it held no information: a
 * decorative line drawing, a mark, and a numeral the rail already carried. The
 * drawing is now the page's ground instead — it replaces `<CircuitField />`
 * here, and only here — and the three columns of copy have the width back.
 *
 * The partner page keeps its plate and keeps the circuit field, and neither is
 * inconsistency. A portrait is a photograph of a named person and the one thing
 * on that page a reader came to look at, so it is content and stays in the
 * composition. And a partner has no drawing of their own to promote, so that
 * page stays on the site's shared decorative layer — the same field the auth
 * pages and the home page stand on. This page is the exception because it is
 * the only one whose decoration IS its subject.
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
   * Still needed with the page held to one screen: the gate is a media query,
   * so below it this page scrolls like any other, and above it the reader may
   * still have scrolled the home page before clicking.
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
          </a>
        }
        links={[
          { label: t('navTeam'), href: '#team' },
          { label: t('navPractice'), href: '#practice' },
          { label: t('navTestimonials'), href: '#testimonials' },
          { label: t('navContact'), href: '#contact' },
        ]}
        cta={<AuthNavControl />}
      />

      <main className="practice-page page-ramp page-ramp--short">
        {/* The domain's own drawing, as the page's ground — see the note above
            for why this is here instead of `<CircuitField />`. The SVG declares
            its own `aria-hidden` (src/assets/domainBackgrounds.tsx). */}
        <Bg className="practice-page__ground" />

        <Container className="practice-page__inner">
          {/* The way back and the page's index on one line. They were two
              stacked blocks — a back link, then an overline inside the identity
              — which spent two rows on two micro-labels. One rail on a hairline
              spends one, and the hairline is the composition's top edge. */}
          <div className="practice-page__rail">
            <a className="practice-page__back" href="#practice">
              <span aria-hidden="true">&#8592;</span>
              {t('practiceBackToAreas')}
            </a>
            {/* The plate's foot used to carry these two — the domain's mark and
                its number — and the plate is gone. They are information, not
                ornament, so they come back into the rail rather than being lost
                with it: the mark is the domain's glyph on the card this page is
                reached from, and the number is its place in the set of ten. */}
            <span className="practice-page__overline">
              <Icon className="practice-page__mark" aria-hidden="true" />
              <EditableText tKey="practiceAreaLabel" as="span" />
              <span className="practice-page__num">{t('practiceDomainNum', { num })}</span>
            </span>
          </div>

          <div className="practice-page__stage">
            <div className="practice-page__identity">
              <EditableText
                tKey={`practice${key}Title`}
                as="h1"
                className="practice-page__title"
              />
              <EditableText tKey={`practice${key}Desc`} as="p" className="practice-page__lede" />

              <a className="practice-page__cta" href="#contact">
                {t('practiceContactCta')}
              </a>
            </div>

            <Card
              as="section"
              lensing={false}
              className="practice-page__panel practice-page__panel--prose"
              aria-labelledby={`practice-overview-${slug}`}
            >
              <h2 className="practice-page__panel-title" id={`practice-overview-${slug}`}>
                {t('practiceOverviewLabel')}
              </h2>
              {/* The scrolling region is this wrapper and never the Card: the
                  Card is the material, and a scrollbar on it would drag the
                  glass's own light layers off the top of the surface. */}
              <div className="practice-page__panel-body">
                <EditableText
                  tKey={`practice${key}Detail`}
                  as="p"
                  className="practice-page__detail"
                />
              </div>
            </Card>

            <Card
              as="section"
              lensing={false}
              className="practice-page__panel practice-page__panel--ledger"
              aria-labelledby={`practice-services-${slug}`}
            >
              <h2 className="practice-page__panel-title" id={`practice-services-${slug}`}>
                {t('practiceServicesLabel')}
              </h2>
              <div className="practice-page__panel-body">
                <ul className="practice-page__ledger">
                  {([1, 2, 3, 4, 5] as const).map((slot) => (
                    <li key={slot} className="practice-page__ledger-row">
                      {/* An ornament, not a rank — the five are unordered, which
                          is why this stays a `ul` and the index is hidden. */}
                      <span className="practice-page__ledger-index" aria-hidden="true">
                        {String(slot).padStart(2, '0')}
                      </span>
                      <EditableText
                        tKey={`practice${key}Service${slot}`}
                        as="span"
                        className="practice-page__ledger-text"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </Container>
      </main>
    </>
  );
}
