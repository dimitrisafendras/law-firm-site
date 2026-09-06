import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/i18n';
import { EditableText } from '@/components';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { useCarousel } from './useCarousel';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
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
 *
 * ## Who is allowed to stop it
 *
 * Three separate things can hold the timer, and they are not equals:
 *
 * - **The preference.** `prefers-reduced-motion: reduce` is an unrequested,
 *   repeating, timed content change turned off at the source. There is no
 *   autoplay to resume, so the transport button is not rendered at all rather
 *   than offered as a control that would contradict the setting.
 * - **The reader.** The transport button is a standing decision. It has to
 *   outlive the pointer — the obvious bug here is a hover handler quietly
 *   resuming a carousel the reader explicitly stopped the moment they move the
 *   mouse away — so it is its own state, and the button reflects *it* rather
 *   than the hook's `paused`.
 * - **The pointer and the viewport.** Hover and off-screen are transient
 *   courtesies. They hold the timer while they last and release it after.
 *
 * All three fold into one boolean before touching the hook, so they cannot
 * fight over `pause()`/`resume()` in whatever order their effects happen to run.
 */
export function TestimonialsSection() {
  const { t } = useTranslation();
  const { index, next, prev, goTo, pause, resume, paused, cycle } = useCarousel({
    count: testimonials.length,
    dwell: DWELL_MS,
  });

  const sectionRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isOnScreen, setIsOnScreen] = useState(true);
  /** The reader's standing decision, kept apart from the transient holds. */
  const [stoppedByReader, setStoppedByReader] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  /* With the preference on there is nothing to start, stop or offer a control
     for: the reader drives the rail by hand. */
  const autoplayOffered = !prefersReducedMotion && testimonials.length > 1;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = autoplayOffered && isOnScreen && !isHovered && !stoppedByReader;

  useEffect(() => {
    if (running) resume();
    else pause();
  }, [running, pause, resume]);

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
              The live region is this wrapper, and it is deliberately unkeyed.

              `aria-live` used to sit on the figure, which carries `key={index}`
              — so React destroyed and rebuilt the element on every change and
              assistive tech was handed a brand-new region rather than a changed
              one. A live region only announces mutations *inside* a region that
              was already there, so nothing was ever announced.

              Splitting the two jobs fixes it without touching the cross-fade:
              the wrapper is stable and does the announcing, the keyed figure
              inside it is what gets swapped, so the entering quote still runs
              its own animation from the start instead of inheriting a
              half-finished one. `aria-atomic` because a quote read without its
              attribution is not the content.
            */}
            <div className="testimonials-stage__live" aria-live="polite" aria-atomic="true">
              <figure key={index} className="testimonials-stage__quote">
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
            </div>

            <div className="testimonials-stage__controls">
              {/*
                Hover was the only way to stop this, which is to say there was
                no way for a keyboard or a touch screen. The transport button is
                the real control, and it is a toggle whose *accessible name*
                changes rather than an `aria-pressed` button — one mechanism, not
                both, so a screen reader never reads a "pause" button as pressed.

                It leads the rail rather than joining it: a round control ahead
                of a row of flat segments reads as a different kind of thing at
                a glance, and in tab order it is the one stop before the
                per-quote targets rather than a seventh one hidden among them.
              */}
              {autoplayOffered && (
                <button
                  type="button"
                  className="testimonials-stage__playback"
                  onClick={() => setStoppedByReader((stopped) => !stopped)}
                  aria-label={stoppedByReader ? t('testimonialsPlay') : t('testimonialsPause')}
                >
                  <svg
                    className="testimonials-stage__playback-icon"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    {stoppedByReader ? (
                      <path d="M4 2.5 13.5 8 4 13.5Z" />
                    ) : (
                      <>
                        <rect x="3.5" y="2.5" width="3.5" height="11" rx="1" />
                        <rect x="9" y="2.5" width="3.5" height="11" rx="1" />
                      </>
                    )}
                  </svg>
                </button>
              )}

              {/*
                The rail doubles as the control surface: each segment is a
                target, and the active one fills over the dwell. Buttons rather
                than a decorative bar, so it is reachable by keyboard and screen
                reader without a parallel dot row.
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
                        segment that is already active, where the `--active`
                        class does not move and a CSS animation would otherwise
                        carry on from wherever it had got to. */}
                    <span
                      key={cycle}
                      className="testimonials-stage__rail-fill"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
