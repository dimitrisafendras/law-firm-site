import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TestimonialCard } from '@/components/TestimonialCard';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { CircuitLines } from '@/components/CircuitLines/CircuitLines';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { useCarousel } from './useCarousel';
import './TestimonialsSection.css';

export function TestimonialsSection() {
  const { t } = useTranslation();

  const testimonials = [
    { quote: t('testimonial1Quote'), author: t('testimonial1Author'), role: t('testimonial1Role') },
    { quote: t('testimonial2Quote'), author: t('testimonial2Author'), role: t('testimonial2Role') },
    { quote: t('testimonial3Quote'), author: t('testimonial3Author'), role: t('testimonial3Role') },
    { quote: t('testimonial4Quote'), author: t('testimonial4Author'), role: t('testimonial4Role') },
    { quote: t('testimonial5Quote'), author: t('testimonial5Author'), role: t('testimonial5Role') },
    { quote: t('testimonial6Quote'), author: t('testimonial6Author'), role: t('testimonial6Role') },
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

  /* Build the tripled slide array: [clone] [real] [clone] */
  const slides = Array.from({ length: totalSlides }, (_, i) => {
    const realIndex = ((i % itemCount) + itemCount) % itemCount;
    return { ...testimonials[realIndex], slideIndex: i };
  });

  return (
    <section id="testimonials" className="testimonials-section">
      <CircuitLines variant="c" />
      <div className="testimonials-section__inner">
        <FadeInSection>
          <SectionHeader
            overline={t('testimonialsOverline')}
            title={t('testimonialsTitle')}
            subtitle={t('testimonialsSubtitle')}
            label="Chapter 04 / Testimonials"
          />
        </FadeInSection>

        <FadeInSection variant="fade-up">
          <div
            className="testimonials-carousel"
            onMouseEnter={pause}
            onMouseLeave={resume}
            role="region"
            aria-roledescription="carousel"
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
                    aria-roledescription="slide"
                    aria-label={`${realIndex + 1} of ${itemCount}`}
                    style={{ width: `calc(100% / ${visibleCount})` }}
                  >
                    <TestimonialCard
                      quote={item.quote}
                      author={item.author}
                      role={item.role}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="testimonials-carousel__controls">
            <button className="testimonials-carousel__btn" onClick={prev} aria-label="Previous testimonial">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="testimonials-carousel__dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`testimonials-carousel__dot${i === realIndex ? ' testimonials-carousel__dot--active' : ''}`}
                  onClick={() => goToReal(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button className="testimonials-carousel__btn" onClick={next} aria-label="Next testimonial">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
