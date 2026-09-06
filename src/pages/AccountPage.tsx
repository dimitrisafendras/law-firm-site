import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useTranslation } from '@/i18n';
import { Navbar, Footer, Container, Card, CardBody, Button, Heading, Text } from '@/components';
import { VkmLogo } from '@/assets/VkmLogo';
import { CircuitField } from '@/components/CircuitField';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { useAuth } from '@/lib/auth/useAuth';
import './AuthPages.css';

export default function AccountPage(): JSX.Element {
  const { t } = useTranslation();
  const { user, profile, isAdmin, loading, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  // While signing out the user disappears before the hash is set to '#', so the
  // guard below must stand down — otherwise it would win the race and land the
  // user on the login page instead of the home page.
  const shouldRedirect = !loading && !user && !signingOut;

  useEffect(() => {
    if (shouldRedirect) {
      window.location.hash = '#login';
    }
  }, [shouldRedirect]);

  // Renders nothing while the effect above sends the visitor to the login page.
  if (shouldRedirect) return <></>;

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    window.location.hash = '#';
  }

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
        cta={
          <div className="navbar__actions">
            <LanguageSwitcher />
            <Button size="sm" variant="secondary" onClick={() => { window.location.hash = '#'; }}>
              {t('authBackToSite')}
            </Button>
          </div>
        }
      />

      <main className="auth-page page-ramp page-ramp--short">
        <CircuitField />
        <Container className="auth-page__inner">
          <Card variant="glow" className="auth-page__card">
            <CardBody>
              {loading || !user ? (
                <div className="auth-page__skeleton" role="status" aria-live="polite" aria-busy="true">
                  <div className="auth-page__skeleton-bar" />
                  <div className="auth-page__skeleton-bar" />
                  <div className="auth-page__skeleton-bar" />
                </div>
              ) : (
                <div className="auth-page__body">
                  <div className="auth-page__head">
                    <Text variant="overline">{t('firmName')}</Text>
                    <Heading level={2} className="auth-page__title">
                      {t('authAccountTitle')}
                    </Heading>
                  </div>

                  <div className="account-panel">
                    <div className="account-panel__row">
                      <span className="account-panel__label">{t('authAccountEmail')}</span>
                      <span className="account-panel__value">{profile?.email ?? user?.email ?? ''}</span>
                    </div>
                    <div className="account-panel__row">
                      <span className="account-panel__label">{t('authAccountRole')}</span>
                      <span className="account-panel__role">
                        {isAdmin ? t('authRoleAdmin') : t('authRoleUser')}
                      </span>
                    </div>
                  </div>

                  {isAdmin && <p className="account-panel__hint">{t('authAdminHint')}</p>}

                  <div className="account-panel__actions">
                    <a className="auth-page__link" href="#">
                      {t('authBackToSite')}
                    </a>
                    <Button variant="secondary" onClick={handleSignOut}>
                      {t('authLogout')}
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Container>
      </main>

      <Footer
        logo={
          <div className="footer-brand">
            <VkmLogo className="footer-brand__mark" title={t('firmName')} />
          </div>
        }
        columns={[]}
        bottom={<p>{t('footerCopyright')}</p>}
      />
    </>
  );
}
