import type { ReactNode } from 'react';
import './AttorneyCard.css';

interface AttorneyCardProps {
  name: string;
  title: string;
  image?: ReactNode;
  specialties?: string[];
  bio?: string;
  href?: string;
}

export function AttorneyCard({ name, title, image, specialties, bio, href }: AttorneyCardProps) {
  return (
    <div className="attorney-card">
      {image && <div className="attorney-card__image">{image}</div>}
      <div className="attorney-card__content">
        <h3 className="attorney-card__name">
          {href ? <a href={href}>{name}</a> : name}
        </h3>
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
    </div>
  );
}
