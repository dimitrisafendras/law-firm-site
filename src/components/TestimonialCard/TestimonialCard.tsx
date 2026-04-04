import { Card } from '@/components/Card';
import './TestimonialCard.css';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
}

export function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <Card as="blockquote" className="testimonial-card">
      <p className="testimonial-card__quote">{quote}</p>
      <footer className="testimonial-card__attribution">
        <cite className="testimonial-card__author">{author}</cite>
        {role && <span className="testimonial-card__role">{role}</span>}
      </footer>
    </Card>
  );
}
