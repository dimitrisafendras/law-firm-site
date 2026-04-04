import type { ReactNode } from 'react';
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
  const content = (
    <>
      {icon && <div className="practice-card__icon">{icon}</div>}
      <Tag className="practice-card__title">{title}</Tag>
      <p className="practice-card__description">{description}</p>
    </>
  );

  if (href) {
    return (
      <a className="practice-card practice-card--link" href={href}>
        {content}
      </a>
    );
  }

  return <div className="practice-card">{content}</div>;
}
