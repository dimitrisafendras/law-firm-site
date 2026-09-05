import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/i18n';
import { TestimonialCard } from '@/components/TestimonialCard';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { CircuitLines } from '@/components/CircuitLines/CircuitLines';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { useCarousel } from './useCarousel';
import './TestimonialsSection.css';

export function TestimonialsSection() {
  const { t } = useTranslation();

  /* Keys, not resolved strings: TestimonialCard routes them through
     EditableText so an admin can edit the copy in place. */
  const testimonials = [
    { quoteKey: 'testimonial1Quote', authorKey: 'testimonial1Author', roleKey: 'testimonial1Role' },
    { quoteKey: 'testimonial2Quote', authorKey: 'testimonial2Author', roleKey: 'testimonial2Role' },
    { quoteKey: 'testimonial3Quote', authorKey: 'testimonial3Author', roleKey: 'testimonial3Role' },
    { quoteKey: 'testimonial4Quote', authorKey: 'testimonial4Author', roleKey: 'testimonial4Role' },
    { quoteKey: 'testimonial5Quote', authorKey: 'testimonial5Author', roleKey: 'testimonial5Role' },
    { quoteKey: 'testimonial6Quote', authorKey: 'testimonial6Author', roleKey: 'testimonial6Role' },
  ];

  /* Responsive visible count: 3 on desktop, 1 on mobile */
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const update = () => setVisibleCount(mq.matches ? 1 : 3);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const {
    trackRef,
    trackStyle,
    totalSlides,
    itemCount,
    currentIndex,
    realIndex,
    next,
    prev,
    goToReal,
    pause,
    resume,
  } = useCarousel({
    itemCount: testimonials.length,
    visibleCount,
    interval: 4000,
  });

  /* Autoplay should run only when the section is on-screen AND not hovered.
     Both signals feed a single derived pause state so they don't fight the
     hook's shared pause()/resume(). */
  const sectionRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isOnScreen, setIsOnScreen] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (isOnScreen && !isHovered) resume();
    else pause();
  }, [isOnScreen, isHovered, pause, resume]);

  /* Build the tripled slide array: [clone] [real] [clone] */
  const slides = Array.from({ length: totalSlides }, (_, i) => {
    const realIndex = ((i % itemCount) + itemCount) % itemCount;
    return { ...testimonials[realIndex], slideIndex: i };
  });

  return (
    <section id="testimonials" className="testimonials-section" ref={sectionRef}>
      <CircuitLines variant="c" />
      <div className="testimonials-section__inner">
        <FadeInSection>
          <SectionHeader
            overlineKey="testimonialsOverline"
            titleKey="testimonialsTitle"
            subtitleKey="testimonialsSubtitle"
            labelKey="chapterTestimonials"
          />
        </FadeInSection>

        <FadeInSection variant="fade-up">
          <div
            className="testimonials-carousel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="region"
            aria-roledescription={t('testimonialsCarouselRole')}
            aria-label={t('testimonialsTitle')}
          >
            <div
              ref={trackRef}
              className="testimonials-carousel__track"
              style={trackStyle}
              aria-live="off"
            >
              {slides.map((item) => {
                const realIndex = ((item.slideIndex % itemCount) + itemCount) % itemCount;
                const isActive = item.slideIndex === currentIndex;

                return (
                  <div
                    key={item.slideIndex}
                    className={`testimonials-carousel__slide${isActive ? ' testimonials-carousel__slide--active' : ''}`}
                    role="group"
                    aria-roledescription={t('testimonialsSlideRole')}
                    aria-label={t('testimonialsSlidePosition', { current: realIndex + 1, total: itemCount })}
                    style={{ width: `calc(100% / ${visibleCount})` }}
                  >
                    <TestimonialCard
                      quoteKey={item.quoteKey}
                      authorKey={item.authorKey}
                      roleKey={item.roleKey}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="testimonials-carousel__controls">
            <button className="testimonials-carousel__btn" onClick={prev} aria-label={t('testimonialsPrevLabel')}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="testimonials-carousel__dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`testimonials-carousel__dot${i === realIndex ? ' testimonials-carousel__dot--active' : ''}`}
                  onClick={() => goToReal(i)}
                  aria-label={t('testimonialsGoToLabel', { index: i + 1 })}
                />
              ))}
            </div>
            <button className="testimonials-carousel__btn" onClick={next} aria-label={t('testimonialsNextLabel')}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
