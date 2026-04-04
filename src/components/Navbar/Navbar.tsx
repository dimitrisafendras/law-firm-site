import { type ReactNode, useEffect, useState } from 'react';
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
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
