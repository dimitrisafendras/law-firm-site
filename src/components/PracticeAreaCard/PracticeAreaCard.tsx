import type { ReactNode } from 'react';
import './PracticeAreaCard.css';

interface PracticeAreaCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  href?: string;
}

export function PracticeAreaCard({ icon, title, description, href }: PracticeAreaCardProps) {
  const content = (
    <>
      {icon && <div className="practice-card__icon">{icon}</div>}
      <h3 className="practice-card__title">{title}</h3>
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
