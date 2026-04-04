import { useTranslation } from 'react-i18next';
import { TestimonialCard } from '@/components/TestimonialCard';
import { FadeInSection, StaggerGroup } from '@/components/animations/FadeInSection';
import './TestimonialsSection.css';

export function TestimonialsSection() {
  const { t } = useTranslation();

  const testimonials = [
    { quote: t('testimonial1Quote'), author: t('testimonial1Author'), role: t('testimonial1Role') },
    { quote: t('testimonial2Quote'), author: t('testimonial2Author'), role: t('testimonial2Role') },
    { quote: t('testimonial3Quote'), author: t('testimonial3Author'), role: t('testimonial3Role') },
  ];

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="testimonials-section__inner">
        <FadeInSection>
          <div className="testimonials-section__header">
            <span className="testimonials-section__overline">{t('testimonialsOverline')}</span>
            <h2 className="testimonials-section__title">{t('testimonialsTitle')}</h2>
          </div>
        </FadeInSection>

        <StaggerGroup className="testimonials-section__grid" interval={0.15}>
          {testimonials.map((item) => (
            <FadeInSection key={item.author} variant="fade-up">
              <TestimonialCard quote={item.quote} author={item.author} role={item.role} />
            </FadeInSection>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
