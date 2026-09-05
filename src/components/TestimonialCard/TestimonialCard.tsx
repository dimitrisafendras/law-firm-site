import { Card } from '@/components/Card';
import { EditableText } from '@/components/EditableText';
import './TestimonialCard.css';

/**
 * The card renders either already-resolved strings (showcases, static usage) or
 * i18n keys. Keys route the copy through EditableText so an admin can edit it in
 * place; the rendered markup is identical for a visitor either way.
 */
interface TestimonialCardTextProps {
  quote: string;
  author: string;
  role?: string;
  quoteKey?: never;
  authorKey?: never;
  roleKey?: never;
}

interface TestimonialCardKeyProps {
  quoteKey: string;
  authorKey: string;
  roleKey?: string;
  quote?: never;
  author?: never;
  role?: never;
}

type TestimonialCardProps = TestimonialCardTextProps | TestimonialCardKeyProps;

export function TestimonialCard(props: TestimonialCardProps) {
  const { quote, author, role, quoteKey, authorKey, roleKey } = props;

  return (
    <Card as="blockquote" className="testimonial-card">
      {quoteKey ? (
        <EditableText tKey={quoteKey} as="p" className="testimonial-card__quote" />
      ) : (
        <p className="testimonial-card__quote">{quote}</p>
      )}
      <footer className="testimonial-card__attribution">
        {authorKey ? (
          <EditableText tKey={authorKey} as="cite" className="testimonial-card__author" />
        ) : (
          <cite className="testimonial-card__author">{author}</cite>
        )}
        {roleKey ? (
          <EditableText tKey={roleKey} as="span" className="testimonial-card__role" />
        ) : (
          role && <span className="testimonial-card__role">{role}</span>
        )}
      </footer>
    </Card>
  );
}
