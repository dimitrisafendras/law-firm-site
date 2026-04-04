import type { ReactNode } from 'react';
import { Card } from '@/components/Card';
import './AttorneyCard.css';

type HeadingLevel = 'h2' | 'h3' | 'h4';

interface AttorneyCardProps {
  name: string;
  title: string;
  image?: ReactNode;
  specialties?: string[];
  bio?: string;
  href?: string;
  headingLevel?: HeadingLevel;
}

export function AttorneyCard({ name, title, image, specialties, bio, href, headingLevel: Tag = 'h3' }: AttorneyCardProps) {
  return (
    <Card className="attorney-card">
      {image && <div className="attorney-card__image">{image}</div>}
      <div className="attorney-card__content">
        <Tag className="attorney-card__name">
          {href ? <a href={href}>{name}</a> : name}
        </Tag>
        <span className="attorney-card__title">{title}</span>
        {specialties && specialties.length > 0 && (
          <div className="attorney-card__specialties">
            {specialties.map((s) => (
              <span key={s} className="attorney-card__specialty">{s}</span>
            ))}
          </div>
        )}
        {bio && <p className="attorney-card__bio">{bio}</p>}
      </div>
    </Card>
  );
}
