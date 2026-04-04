import type { ReactNode } from 'react';
import './Navbar.css';

interface NavLinkItem {
  label: string;
  href: string;
}

interface NavbarProps {
  logo: ReactNode;
  links: NavLinkItem[];
  cta?: ReactNode;
}

export function Navbar({ logo, links, cta }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <div className="navbar__logo">{logo}</div>
        <ul className="navbar__links">
          {links.map((link) => (
            <li key={link.href}>
              <a className="navbar__link" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        {cta && <div className="navbar__cta">{cta}</div>}
      </div>
    </nav>
  );
}
