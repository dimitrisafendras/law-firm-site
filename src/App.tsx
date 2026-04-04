import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DesignSystem from './pages/DesignSystem';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';
import {
  Navbar,
  Hero,
  Section,
  Button,
  PracticeAreaCard,
  AttorneyCard,
  TestimonialCard,
  ContactForm,
  Footer,
  Text,
} from './components';
import {
  DigitalAcropolis,
  RealEstateIcon,
  StartupFundingIcon,
  MaritimeIcon,
  CryptoIcon,
  AvatarMale,
  AvatarFemale,
  ScaleOfJustice,
} from './assets/illustrations';
import './App.css';

function App() {
  const { t } = useTranslation();
  const [page, setPage] = useState(window.location.hash);

  useEffect(() => {
    const onHash = () => setPage(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (page === '#design-system') return <DesignSystem />;

  return (
    <>
      {/* ── Navbar ── */}
      <Navbar
        logo={
          <a href="#" className="firm-logo">
            <ScaleOfJustice className="firm-logo__icon" />
            <span className="firm-logo__text">
              {t('firmName')}
              <span className="firm-logo__tagline">{t('firmTagline')}</span>
            </span>
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
            <Button size="sm" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('navCta')}
            </Button>
          </div>
        }
      />

      {/* ── Hero ── */}
      <div className="hero-wrapper">
        <Hero
          overline={t('heroOverline')}
          title={t('heroTitle')}
          subtitle={t('heroSubtitle')}
          actions={
            <>
              <Button
                size="lg"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('heroCta')}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => document.getElementById('practice')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('heroSecondaryCta')}
              </Button>
            </>
          }
          image={<DigitalAcropolis className="hero-acropolis" />}
        />
      </div>

      {/* ── Stats Bar ── */}
      <div className="stats-bar">
        <div className="stats-bar__inner">
          {[
            { value: '500+', label: t('statClients') },
            { value: '\u20AC2B+', label: t('statTransactions') },
            { value: '30+', label: t('statYears') },
            { value: '12', label: t('statJurisdictions') },
          ].map((stat) => (
            <div key={stat.label} className="stats-bar__item">
              <span className="stats-bar__value">{stat.value}</span>
              <span className="stats-bar__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Practice Areas ── */}
      <Section id="practice">
        <div className="section-inner">
          <div className="section-header">
            <Text variant="overline">{t('practiceOverline')}</Text>
            <h2>{t('practiceTitle')}</h2>
            <Text variant="lead" className="section-header__subtitle">
              {t('practiceSubtitle')}
            </Text>
          </div>
          <div className="practice-grid">
            <PracticeAreaCard
              icon={<RealEstateIcon className="practice-icon" />}
              title={t('practiceRealEstateTitle')}
              description={t('practiceRealEstateDesc')}
            />
            <PracticeAreaCard
              icon={<StartupFundingIcon className="practice-icon" />}
              title={t('practiceStartupTitle')}
              description={t('practiceStartupDesc')}
            />
            <PracticeAreaCard
              icon={<MaritimeIcon className="practice-icon" />}
              title={t('practiceMaritimeTitle')}
              description={t('practiceMaritimeDesc')}
            />
            <PracticeAreaCard
              icon={<CryptoIcon className="practice-icon" />}
              title={t('practiceCryptoTitle')}
              description={t('practiceCryptoDesc')}
            />
          </div>
        </div>
      </Section>

      {/* ── Team ── */}
      <Section id="team" variant="surface">
        <div className="section-inner">
          <div className="section-header">
            <Text variant="overline">{t('teamOverline')}</Text>
            <h2>{t('teamTitle')}</h2>
            <Text variant="lead" className="section-header__subtitle">
              {t('teamSubtitle')}
            </Text>
          </div>
          <div className="team-grid">
            <AttorneyCard
              name={t('attorney1Name')}
              title={t('attorney1Title')}
              image={<AvatarMale />}
              specialties={[t('attorney1Spec1'), t('attorney1Spec2'), t('attorney1Spec3')]}
              bio={t('attorney1Bio')}
            />
            <AttorneyCard
              name={t('attorney2Name')}
              title={t('attorney2Title')}
              image={<AvatarFemale />}
              specialties={[t('attorney2Spec1'), t('attorney2Spec2'), t('attorney2Spec3')]}
              bio={t('attorney2Bio')}
            />
          </div>
        </div>
      </Section>

      {/* ── Testimonials ── */}
      <Section id="testimonials">
        <div className="section-inner">
          <div className="section-header">
            <Text variant="overline">{t('testimonialsOverline')}</Text>
            <h2>{t('testimonialsTitle')}</h2>
          </div>
          <div className="testimonials-grid">
            <TestimonialCard
              quote={t('testimonial1Quote')}
              author={t('testimonial1Author')}
              role={t('testimonial1Role')}
            />
            <TestimonialCard
              quote={t('testimonial2Quote')}
              author={t('testimonial2Author')}
              role={t('testimonial2Role')}
            />
            <TestimonialCard
              quote={t('testimonial3Quote')}
              author={t('testimonial3Author')}
              role={t('testimonial3Role')}
            />
          </div>
        </div>
      </Section>

      {/* ── Contact ── */}
      <Section id="contact" variant="surface">
        <div className="section-inner">
          <div className="contact-layout">
            <div className="contact-info">
              <Text variant="overline">{t('contactOverline')}</Text>
              <h2>{t('contactTitle')}</h2>
              <Text variant="lead" className="contact-info__subtitle">
                {t('contactSubtitle')}
              </Text>
              <div className="contact-details">
                <div className="contact-details__item">
                  <span className="contact-details__icon" aria-hidden="true">&#9906;</span>
                  <span>{t('contactAddress')}</span>
                </div>
                <div className="contact-details__item">
                  <span className="contact-details__icon" aria-hidden="true">&#9993;</span>
                  <a href={`mailto:${t('contactEmail')}`}>{t('contactEmail')}</a>
                </div>
                <div className="contact-details__item">
                  <span className="contact-details__icon" aria-hidden="true">&#9742;</span>
                  <a href={`tel:${t('contactPhone')}`}>{t('contactPhone')}</a>
                </div>
              </div>
            </div>
            <div className="contact-form-wrapper">
              <ContactForm onSubmit={(data) => console.log('Form submitted:', data)} />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Footer ── */}
      <Footer
        logo={
          <div className="footer-brand">
            <ScaleOfJustice className="footer-brand__icon" />
            <span>{t('firmName')}</span>
          </div>
        }
        columns={[
          {
            title: t('footerPractice'),
            links: [
              { label: t('practiceRealEstateTitle'), href: '#practice' },
              { label: t('practiceStartupTitle'), href: '#practice' },
              { label: t('practiceMaritimeTitle'), href: '#practice' },
              { label: t('practiceCryptoTitle'), href: '#practice' },
            ],
          },
          {
            title: t('footerFirm'),
            links: [
              { label: t('footerAbout'), href: '#' },
              { label: t('navTeam'), href: '#team' },
              { label: t('footerCareers'), href: '#' },
              { label: t('footerPrivacy'), href: '#' },
            ],
          },
          {
            title: t('footerConnect'),
            links: [
              { label: t('footerLinkedIn'), href: '#' },
              { label: t('footerEmail'), href: `mailto:${t('contactEmail')}` },
              { label: t('contactPhone'), href: `tel:${t('contactPhone')}` },
            ],
          },
        ]}
        bottom={<p>{t('footerCopyright')}</p>}
      />
    </>
  );
}

export default App;
