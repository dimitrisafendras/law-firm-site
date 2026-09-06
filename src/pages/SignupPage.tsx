import type { JSX } from 'react';
import { useTranslation } from '@/i18n';
import { Navbar, Footer, Container, Card, CardBody, Button, Heading, Text } from '@/components';
import { VkmLogo } from '@/assets/VkmLogo';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { AuthForm } from '@/components/AuthForm/AuthForm';
import { CircuitField } from '@/components/CircuitField/CircuitField';
import './AuthPages.css';

export default function SignupPage(): JSX.Element {
  const { t } = useTranslation();

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
            <Button size="sm" variant="secondary" onClick={() => { window.location.hash = '#login'; }}>
              {t('authLogin')}
            </Button>
          </div>
        }
      />

      <main className="auth-page page-ramp page-ramp--short">
        <CircuitField />
        <Container className="auth-page__inner">
          <Card variant="glow" className="auth-page__card">
            <CardBody>
              <div className="auth-page__body">
                <div className="auth-page__head">
                  <Text variant="overline">{t('firmName')}</Text>
                  <Heading level={2} className="auth-page__title">
                    {t('authSignup')}
                  </Heading>
                </div>

                <AuthForm mode="signup" />
              </div>
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
