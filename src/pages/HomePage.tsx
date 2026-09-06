import { useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { Navbar, Footer, Button, EditableText, AuthNavControl } from '@/components';
import { VkmLogo } from '@/assets/VkmLogo';
import { HeroSection } from '@/components/sections/HeroSection/HeroSection';
import { PracticeGrid } from '@/components/sections/PracticeGrid/PracticeGrid';
import { PartnerEthos } from '@/components/sections/PartnerEthos/PartnerEthos';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection/TestimonialsSection';
import { ContactSection } from '@/components/sections/ContactSection/ContactSection';
import { CircuitField } from '@/components/CircuitField';

export default function HomePage() {
  const { t } = useTranslation();

  /*
   * Land on the section the hash names when this page is the one that just
   * arrived.
   *
   * A browser resolves `#team` against the document as it stands when the hash
   * changes. Coming back from a partner profile there is no `#team` yet — this
   * component has not rendered — so the browser finds nothing, does nothing,
   * and "Back to all partners" left you at the top of the page looking at the
   * hero. Same for any footer link out of the auth pages.
   *
   * Mount only, so an in-page anchor click on a page that is already showing
   * is left to the browser and keeps its native smooth scroll.
   *
   * `instant`, because this scroll is a page arrival rather than a movement
   * across a page the reader is already looking at — the root's
   * `scroll-behavior: smooth` would otherwise animate it up from wherever the
   * previous page happened to sit.
   *
   * The retry loop is for `content-visibility: auto`: sections below the fold
   * report their reserved `contain-intrinsic-size` rather than their real
   * height, so the first scroll lands short and the true offset only settles
   * once the intervening sections have been rendered. Re-measuring across a
   * few frames converges instead of guessing a delay.
   */
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, '').split(/[?&]/)[0];
    if (!id) return;

    const align = () => document.getElementById(id)?.scrollIntoView({
      behavior: 'instant',
      block: 'start',
    });

    /*
     * Three aligns spaced out in time, deliberately not a convergence loop.
     *
     * A loop that re-aligns as soon as the last align moved the page chases a
     * target that is still moving: every scroll down realises more
     * `content-visibility` sections and un-realises the ones left behind, the
     * target's offset shifts again, and the loop rides it to the bottom of the
     * document. Measured doing exactly that — it overshot the team section by
     * 3,231px and hit the end of the page.
     *
     * Re-aligning only after layout has had time to settle converges instead,
     * because each attempt starts from a page that has stopped moving. Three is
     * enough for the deepest section on this page and is bounded by
     * construction.
     *
     * The first is synchronous: this effect runs after the DOM is committed, so
     * the target already exists, and a background tab pauses rAF and throttles
     * timers — a link opened in one would otherwise sit at the top until it was
     * looked at.
     */
    align();
    const timers = [setTimeout(align, 120), setTimeout(align, 400)];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      <Navbar
        deferCta
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
        primaryCta={
          <Button
            size="sm"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('navCta')}
          </Button>
        }
        cta={<AuthNavControl />}
      />

      {/* `--screens` gives each section a viewport of its own (App.css). It is
          a class rather than a rule on `.page-ramp` because every route shares
          that element, and the detail and auth pages are not built to be read a
          screen at a time. */}
      <main className="page-ramp page-ramp--screens">
        <CircuitField />
        <HeroSection />
        <PracticeGrid />
        <PartnerEthos />
        <TestimonialsSection />
        {/* The map band that used to be its own "Global Network" section lives
            inside ContactSection now — one office, one pin, one section. */}
        <ContactSection />
      </main>

      <Footer
        logo={
          <div className="footer-brand">
            <VkmLogo className="footer-brand__mark" title={t('firmName')} />
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
        meta={
          <>
            <EditableText tKey="contactAddress" as="span" />
            <EditableText tKey="footerBarRegistration" as="span" />
            <EditableText tKey="footerVat" as="span" />
          </>
        }
        bottom={<EditableText tKey="footerCopyright" as="p" />}
      />
    </>
  );
}
