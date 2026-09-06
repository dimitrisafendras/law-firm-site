import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/i18n';
import { EditableText } from '@/components';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { useCarousel } from './useCarousel';
import './TestimonialsSection.css';

const DWELL_MS = 8000;

/* Keys, not resolved strings: routed through EditableText so an admin can edit
   the copy in place. */
const testimonials = [
  { quoteKey: 'testimonial1Quote', authorKey: 'testimonial1Author', roleKey: 'testimonial1Role' },
  { quoteKey: 'testimonial2Quote', authorKey: 'testimonial2Author', roleKey: 'testimonial2Role' },
  { quoteKey: 'testimonial3Quote', authorKey: 'testimonial3Author', roleKey: 'testimonial3Role' },
  { quoteKey: 'testimonial4Quote', authorKey: 'testimonial4Author', roleKey: 'testimonial4Role' },
  { quoteKey: 'testimonial5Quote', authorKey: 'testimonial5Author', roleKey: 'testimonial5Role' },
  { quoteKey: 'testimonial6Quote', authorKey: 'testimonial6Author', roleKey: 'testimonial6Role' },
];

/**
 * One quote at a time, at display size.
 *
 * The three-across carousel with scaled neighbours, chevrons and a dot row is
 * the stock component for this slot, and it was failing on its own terms: the
 * active card was never centred on mobile, so a phone showed two half-cards
 * and no complete quote, and at 1440 a fourth card was sliced by the viewport
 * edge in a way that read as a rendering fault.
 *
 * It was also machinery for a problem the final content will not have. Six
 * placeholder quotes become two or three real ones, and a track built to clone
 * an infinite row is a lot of apparatus for three items.
 *
 * The rail is the control. A progress line filling across the dwell says both
 * where you are and that something is moving, which is what a dot row is for —
 * and unlike dots it does not need one target per quote, so it works the same
 * with three quotes or ten.
 *
 * The stage is a glass surface rather than bare page. Set directly on the
 * ramp, the display-size italic had the fixed circuit field running straight
 * through it — lines crossing letterforms at the size where they are least
 * forgiving. The material solves it the way it is supposed to: it blurs what
 * is behind into texture instead of masking it, so the field still shows and
 * the quote sits on something.
 */
export function TestimonialsSection() {
  const { t } = useTranslation();
  const { index, next, prev, goTo, pause, resume, paused, cycle } = useCarousel({
    count: testimonials.length,
    dwell: DWELL_MS,
  });

  /* Autoplay runs only while the section is on-screen and unhovered. Both
     signals feed one derived pause state so they don't fight each other. */
  const sectionRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isOnScreen, setIsOnScreen] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (isOnScreen && !isHovered) resume();
    else pause();
  }, [isOnScreen, isHovered, pause, resume]);

  const active = testimonials[index];

  return (
    <section id="testimonials" className="testimonials-section" ref={sectionRef}>
      <div className="testimonials-section__inner">
        <FadeInSection>
          <SectionHeader
            titleKey="testimonialsTitle"
            subtitleKey="testimonialsSubtitle"
            labelKey="chapterTestimonials"
          />
        </FadeInSection>

        <FadeInSection>
          <div
            className="testimonials-stage glass"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="region"
            aria-roledescription={t('testimonialsCarouselRole')}
            aria-label={t('testimonialsTitle')}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                next();
              } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                prev();
              }
            }}
          >
            {/*
              `key` on the figure is what drives the cross-fade: React swaps the
              element rather than mutating it, so the entering quote runs its
              own animation from the start instead of inheriting a half-finished
              one from the quote it replaced.
            */}
            <figure key={index} className="testimonials-stage__quote" aria-live="polite">
              <blockquote className="testimonials-stage__text">
                <EditableText tKey={active.quoteKey} as="span" />
              </blockquote>
              <figcaption className="testimonials-stage__attribution">
                <EditableText
                  tKey={active.authorKey}
                  as="span"
                  className="testimonials-stage__author"
                />
                <EditableText
                  tKey={active.roleKey}
                  as="span"
                  className="testimonials-stage__role"
                />
              </figcaption>
            </figure>

            {/*
              The rail doubles as the control surface: each segment is a target,
              and the active one fills over the dwell. Buttons rather than a
              decorative bar, so it is reachable by keyboard and screen reader
              without a parallel dot row.
            */}
            <div className="testimonials-stage__rail">
              {testimonials.map((item, i) => (
                <button
                  key={item.quoteKey}
                  type="button"
                  className={`testimonials-stage__rail-segment ${
                    i === index ? 'testimonials-stage__rail-segment--active' : ''
                  }`}
                  data-paused={i === index && paused ? 'true' : undefined}
                  style={{ '--dwell': `${DWELL_MS}ms` } as React.CSSProperties}
                  aria-label={t('testimonialsGoToLabel', { index: String(i + 1) })}
                  aria-current={i === index ? 'true' : undefined}
                  onClick={() => goTo(i)}
                >
                  {/* Keyed on `cycle` so the fill remounts — and so restarts
                      from zero — on every advance, including a click on the
                      segment that is already active, where the `--active` class
                      does not move and a CSS animation would otherwise carry on
                      from wherever it had got to. */}
                  <span
                    key={cycle}
                    className="testimonials-stage__rail-fill"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
