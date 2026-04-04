import type { ReactNode } from 'react';
import './Footer.css';

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

interface FooterProps {
  logo: ReactNode;
  columns: FooterColumn[];
  bottom?: ReactNode;
}

export function Footer({ logo, columns, bottom }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">{logo}</div>
        <div className="footer__columns">
          {columns.map((col) => (
            <div key={col.title} className="footer__column">
              <span className="footer__column-title">{col.title}</span>
              <ul className="footer__column-links">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a className="footer__link" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {bottom && (
        <div className="footer__bottom">{bottom}</div>
      )}
    </footer>
  );
}
