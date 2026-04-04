import type { ReactNode } from 'react';
import { Card } from '@/components/Card';
import './PracticeAreaCard.css';

type HeadingLevel = 'h2' | 'h3' | 'h4';

interface PracticeAreaCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  href?: string;
  headingLevel?: HeadingLevel;
}

export function PracticeAreaCard({ icon, title, description, href, headingLevel: Tag = 'h3' }: PracticeAreaCardProps) {
  return (
    <Card as={href ? 'a' : 'div'} clickable={!!href} className="practice-card" {...(href ? { href } : {})}>
      {icon && <div className="practice-card__icon">{icon}</div>}
      <Tag className="practice-card__title">{title}</Tag>
      <p className="practice-card__description">{description}</p>
    </Card>
  );
}
