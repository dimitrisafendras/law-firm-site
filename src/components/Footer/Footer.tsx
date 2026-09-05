import type { ReactNode } from 'react';
import { EditableText } from '@/components/EditableText';
import './Footer.css';

interface FooterLink {
  /** Resolved label, for callers passing literals (the design system showcase). */
  label: string;
  href: string;
  /**
   * Translation key. When present the link renders through EditableText so an
   * admin can edit it in place. The anchor itself is the editable element, so
   * the visitor DOM is unchanged and an href derived from the same key cannot
   * drift away from the text.
   */
  labelKey?: string;
}

interface FooterColumn {
  title: string;
  titleKey?: string;
  links: FooterLink[];
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
              {col.titleKey ? (
                <EditableText tKey={col.titleKey} as="span" className="footer__column-title" />
              ) : (
                <span className="footer__column-title">{col.title}</span>
              )}
              <ul className="footer__column-links">
                {col.links.map((link) => (
                  <li key={link.labelKey ?? link.label}>
                    {link.labelKey ? (
                      <EditableText
                        tKey={link.labelKey}
                        as="a"
                        className="footer__link"
                        elementProps={{ href: link.href }}
                      />
                    ) : (
                      <a className="footer__link" href={link.href}>
                        {link.label}
                      </a>
                    )}
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
