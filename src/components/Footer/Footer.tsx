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
  /**
   * Registration details under the wordmark — address, bar association number,
   * VAT. For a law firm these are a credibility signal, and they are also what
   * fills the brand column: without them the footer sets a logo hard left and
   * link columns hard right with a very visible gap between.
   */
  meta?: ReactNode;
}

export function Footer({ logo, columns, bottom, meta }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand-col">
          <div className="footer__brand">{logo}</div>
          {meta && <div className="footer__meta">{meta}</div>}
        </div>
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
