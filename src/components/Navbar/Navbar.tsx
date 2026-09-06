import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
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

const MOBILE_MENU_ID = 'navbar-mobile-menu';

/**
 * Reports the material of whatever is currently under the fixed header.
 *
 * The header floats over the page, so it cannot know from CSS alone what it is
 * sitting on — and the marble section is pale enough that the dark nav tint
 * composites to a light grey, which would leave the nav's light text at about
 * 1.4:1. Returning 'marble' lets the bar adopt the same `data-material`
 * attribute the section uses, so it inherits the entire light token block and
 * needs no parallel set of styles.
 *
 * Sampled per animation frame while scrolling rather than via an
 * IntersectionObserver: an observer on a strip as thin as the header can be
 * skipped entirely by a fast scroll, and this is a state that has to be right
 * at every scroll position rather than merely eventually.
 */
function useMaterialUnderNav(): 'marble' | null {
  const [material, setMaterial] = useState<'marble' | null>(null);

  useEffect(() => {
    let frame = 0;

    const sample = () => {
      frame = 0;
      const header = document.querySelector('.navbar');
      const band = header?.getBoundingClientRect().height ?? 64;
      const hit = [...document.querySelectorAll<HTMLElement>('[data-material="marble"]')].some(
        (el) => {
          // Ignore the navbar itself once it has adopted the attribute,
          // otherwise the state latches on and can never clear.
          if (el.closest('.navbar')) return false;
          const r = el.getBoundingClientRect();
          return r.top <= band && r.bottom >= 0;
        },
      );
      setMaterial(hit ? 'marble' : null);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(sample);
    };

    sample();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return material;
}
const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Navbar({ logo, links, cta }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const material = useMaterialUnderNav();

  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // Return focus to the trigger so keyboard users aren't dropped at the top.
    toggleRef.current?.focus();
  }, []);

  // Body scroll lock + focus management + key handling while the menu is open.
  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    // Move focus into the panel (first interactive element).
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      // Minimal focus trap: keep Tab cycling within the panel.
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusables.length === 0) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && active === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      root.style.overflow = previousOverflow;
    };
  }, [open, close]);

  // Close if the viewport grows past the mobile breakpoint while open, so the
  // desktop layout is never shown with a locked body / stale open state.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(min-width: 1025px)');
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [open]);

  // The scrolled header wears the glass — but never while the mobile overlay is
  // open. A backdrop-filter here would make the header the containing block for
  // the overlay's fixed box, and would leave the overlay's own blur with nothing
  // but the header's output to sample.
  const headerGlass = scrolled && !open;

  return (
    <nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${headerGlass ? 'glass' : ''}`}
      data-material={material ?? undefined}
    >
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

        <button
          ref={toggleRef}
          type="button"
          className={`navbar__toggle ${open ? 'navbar__toggle--open' : ''}`}
          aria-label="Menu"
          aria-expanded={open}
          aria-controls={MOBILE_MENU_ID}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="navbar__toggle-bars" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <div
        id={MOBILE_MENU_ID}
        ref={panelRef}
        className={`navbar__mobile glass ${open ? 'navbar__mobile--open' : ''}`}
        onClick={(event) => {
          // Backdrop click (outside the panel content) closes the menu.
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="navbar__mobile-panel">
          <ul className="navbar__mobile-links">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  className="navbar__mobile-link"
                  href={link.href}
                  onClick={close}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {cta && (
            <div className="navbar__mobile-cta" onClick={close}>
              {cta}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
