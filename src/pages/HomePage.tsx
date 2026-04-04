import { useTranslation } from 'react-i18next';
import { Navbar, Footer, Button } from '@/components';
import { ScaleOfJustice } from '@/assets/illustrations';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { HeroSection } from '@/components/sections/HeroSection/HeroSection';
import { StatsBar } from '@/components/sections/StatsBar/StatsBar';
import { PracticeGrid } from '@/components/sections/PracticeGrid/PracticeGrid';
import { PartnerEthos } from '@/components/sections/PartnerEthos/PartnerEthos';
import { NetworkMap } from '@/components/sections/NetworkMap/NetworkMap';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection/TestimonialsSection';
import { ContactSection } from '@/components/sections/ContactSection/ContactSection';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
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
            <Button
              size="sm"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('navCta')}
            </Button>
          </div>
        }
      />

      <HeroSection />
      <StatsBar />
      <PracticeGrid />
      <PartnerEthos />
      <NetworkMap />
      <TestimonialsSection />
      <ContactSection />

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
