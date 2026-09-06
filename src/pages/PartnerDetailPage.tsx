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
 * for a page that has exactly one destination. The main's own bottom padding
 * closes the composition instead. `App` resolves the id before rendering; an id
 * with no partner behind it never reaches this component.
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
          { label: t('navPractice'), href: '#practice' },
          { label: t('navTeam'), href: '#team' },
          { label: t('navTestimonials'), href: '#testimonials' },
          { label: t('navContact'), href: '#contact' },
        ]}
        cta={<AuthNavControl />}
      />

      <main className="partner-page page-ramp page-ramp--short">
        <CircuitField />

        <Container className="partner-page__inner">
          <a className="partner-page__back" href="#team">
            <span aria-hidden="true">&#8592;</span>
            {t('partnerBackToTeam')}
          </a>

          <div className="partner-page__masthead">
            <Card as="figure" lensing={false} className="partner-page__portrait">
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
            </Card>

            <div className="partner-page__intro">
              <EditableText
                tKey="partnerProfileLabel"
                as="span"
                className="partner-page__overline"
              />
              <EditableText tKey={`attorney${n}Name`} as="h1" className="partner-page__name" />
              <EditableText tKey={`attorney${n}Title`} as="p" className="partner-page__title" />
              <p className="partner-page__role">
                <EditableText tKey={`attorney${n}Spec1`} as="span" /> &amp;{' '}
                <EditableText tKey={`attorney${n}Spec2`} as="span" />
              </p>

              <dl className="partner-page__meta">
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

              <a className="partner-page__cta" href="#contact">
                {t('partnerContactCta')}
              </a>
            </div>
          </div>

          <div className="partner-page__panels">
            <Card
              as="section"
              lensing={false}
              className="partner-page__panel"
              aria-labelledby={`partner-about-${n}`}
            >
              <h2 className="partner-page__panel-title" id={`partner-about-${n}`}>
                {t('partnerAboutLabel')}
              </h2>
              <EditableText tKey={`attorney${n}Bio`} as="p" className="partner-page__bio" />
            </Card>

            <Card
              as="section"
              lensing={false}
              className="partner-page__panel"
              aria-labelledby={`partner-specialties-${n}`}
            >
              <h2 className="partner-page__panel-title" id={`partner-specialties-${n}`}>
                {t('partnerSpecialtiesLabel')}
              </h2>
              <ul className="partner-page__specialties">
                {([1, 2, 3] as const).map((slot) => (
                  <li key={slot} className="partner-page__specialty">
                    <EditableText tKey={`attorney${n}Spec${slot}`} as="span" />
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </main>
    </>
  );
}
