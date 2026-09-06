import { useEffect } from 'react';
import type { JSX } from 'react';
import { useTranslation } from '@/i18n';
import { Navbar, Container, Card, EditableText, AuthNavControl } from '@/components';
import { VkmLogo } from '@/assets/VkmLogo';
import { CircuitField } from '@/components/CircuitField/CircuitField';
import type { Partner } from '@/components/sections/PartnerEthos/partners';
import './PartnerDetailPage.css';

interface PartnerDetailPageProps {
  partner: Partner;
}

/**
 * One partner, at `#partner/<n>`.
 *
 * Every string is an `attorneyN*` key the team section already uses, so the
 * card and this page can never disagree about a name or a biography, and an
 * admin editing either one edits both.
 *
 * Same ground as the auth pages — Navbar over a `.page-ramp` main with the
 * circuit field — so it stands on the site's ground rather than beside it. No
 * footer: this page is one profile with a way back to the team section at the
 * top of it, and a full sitemap under a single biography is a second navigation
 * for a page that has exactly one destination. `App` resolves the id before
 * rendering; an id with no partner behind it never reaches this component.
 *
 * ─── The composition, and why it is this one ────────────────────────────────
 *
 * The practice detail page is built from the same four regions under the same
 * names, and PracticeDetailPage.tsx documents the reasoning once for both:
 *
 *   rail      one line: the way back on the left, the page's index on the right
 *   plate     the figure — a portrait here, the practice page's artwork there
 *   identity  h1 with a chip column on the right
 *   panels    prose on the left, a numbered ledger on the right
 *
 * Two things are this page's own. The focus/origin pair has moved out of the
 * identity and onto the plate's foot, where it captions the portrait instead of
 * sitting between the role and the call to action costing the identity a whole
 * row. And the three specialisations are the same numbered ledger the practice
 * page gives its five services — as pills they filled the top eighth of a
 * full-height panel and left the rest empty, which is the fault this layout
 * exists to remove.
 */
export default function PartnerDetailPage({ partner }: PartnerDetailPageProps): JSX.Element {
  const { n, avif, fallback } = partner;
  const { t } = useTranslation();

  /*
   * A hash the document has no element for leaves the scroll position exactly
   * where it was, so arriving from a card halfway down the home page would open
   * this one halfway down. Keyed on `n` so moving between two partners resets
   * too.
   *
   * Still needed with the page held to one screen: the gate is a media query,
   * so below it this page scrolls like any other, and above it the reader may
   * still have scrolled the home page before clicking.
   *
   * `behavior: 'instant'` rather than the default: index.css sets
   * `scroll-behavior: smooth` on the root for in-page anchors, and the default
   * `'auto'` defers to it — which would animate a page that has already been
   * replaced all the way up from wherever the team section happened to be.
   */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [n]);

  const name = t(`attorney${n}Name`);

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

      <main className="partner-page page-ramp page-ramp--short">
        <CircuitField />

        <Container className="partner-page__inner">
          {/* The way back and what this page is, on one line over the hairline
              that is the composition's top edge — two stacked micro-labels
              before, two rows for two labels. */}
          <div className="partner-page__rail">
            <a className="partner-page__back" href="#team">
              <span aria-hidden="true">&#8592;</span>
              {t('partnerBackToTeam')}
            </a>
            <EditableText
              tKey="partnerProfileLabel"
              as="span"
              className="partner-page__overline"
            />
          </div>

          <div className="partner-page__stage">
            <Card as="figure" lensing={false} className="partner-page__plate">
              <picture>
                <source type="image/avif" srcSet={avif} />
                <img
                  src={fallback}
                  alt={name}
                  className="partner-page__image"
                  width={512}
                  height={640}
                  decoding="async"
                />
              </picture>

              {/* Captions the portrait rather than interrupting the identity.
                  A `dl` still, because it is still two label/value pairs — only
                  the place it sits and the register it is set in changed. */}
              <dl className="partner-page__plate-foot">
                <div className="partner-page__meta-item">
                  <EditableText
                    tKey="teamFocusLabel"
                    as="dt"
                    className="partner-page__meta-label"
                  />
                  <EditableText
                    tKey={`attorney${n}Focus`}
                    as="dd"
                    className="partner-page__meta-value"
                  />
                </div>
                <div className="partner-page__meta-item">
                  <EditableText
                    tKey="teamOriginLabel"
                    as="dt"
                    className="partner-page__meta-label"
                  />
                  <EditableText
                    tKey={`attorney${n}Origin`}
                    as="dd"
                    className="partner-page__meta-value"
                  />
                </div>
              </dl>
            </Card>

            <div className="partner-page__identity">
              <EditableText tKey={`attorney${n}Name`} as="h1" className="partner-page__name" />
              <EditableText tKey={`attorney${n}Title`} as="p" className="partner-page__title" />
              <p className="partner-page__role">
                <EditableText tKey={`attorney${n}Spec1`} as="span" /> &amp;{' '}
                <EditableText tKey={`attorney${n}Spec2`} as="span" />
              </p>

              <a className="partner-page__cta" href="#contact">
                {t('partnerContactCta')}
              </a>
            </div>

            <Card
              as="section"
              lensing={false}
              className="partner-page__panel partner-page__panel--prose"
              aria-labelledby={`partner-about-${n}`}
            >
              <h2 className="partner-page__panel-title" id={`partner-about-${n}`}>
                {t('partnerAboutLabel')}
              </h2>
              {/* The scrolling region is this wrapper and never the Card: the
                  Card is the material, and a scrollbar on it would drag the
                  glass's own light layers off the top of the surface. */}
              <div className="partner-page__panel-body">
                <EditableText tKey={`attorney${n}Bio`} as="p" className="partner-page__bio" />
              </div>
            </Card>

            <Card
              as="section"
              lensing={false}
              className="partner-page__panel partner-page__panel--ledger"
              aria-labelledby={`partner-specialties-${n}`}
            >
              <h2 className="partner-page__panel-title" id={`partner-specialties-${n}`}>
                {t('partnerSpecialtiesLabel')}
              </h2>
              <div className="partner-page__panel-body">
                <ul className="partner-page__ledger">
                  {([1, 2, 3] as const).map((slot) => (
                    <li key={slot} className="partner-page__ledger-row">
                      {/* An ornament, not a rank — the three are unordered,
                          which is why this stays a `ul` and the index is
                          hidden. */}
                      <span className="partner-page__ledger-index" aria-hidden="true">
                        {String(slot).padStart(2, '0')}
                      </span>
                      <EditableText
                        tKey={`attorney${n}Spec${slot}`}
                        as="span"
                        className="partner-page__ledger-text"
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
