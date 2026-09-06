import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import './Navbar.css';

interface NavLinkItem {
  label: string;
  href: string;
}

interface NavbarProps {
  logo: ReactNode;
  links: NavLinkItem[];
  /**
   * Persistent header controls — language, sign-in, avatar. Always visible.
   */
  cta?: ReactNode;
  /**
   * The bar's primary call to action, kept separate from `cta` because it is
   * the only part that may be deferred.
   *
   * On a page whose hero carries its own call to action, showing the same
   * button in the bar at the same time puts two identical primary controls in
   * one viewport — which reads as a mistake rather than as emphasis, and
   * halves the weight of both. This one waits until the hero's has scrolled
   * away; the controls beside it never do, because hiding sign-in and the
   * language switch on the first screen removes navigation rather than
   * removing a duplicate.
   */
  primaryCta?: ReactNode;
  /** Defer `primaryCta` until the page has scrolled past its first screen. */
  deferCta?: boolean;
}

const MOBILE_MENU_ID = 'navbar-mobile-menu';
const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Navbar({ logo, links, cta, primaryCta, deferCta = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      // 62% of the viewport: past the hero's own call to action but well
      // before the next section's, so the bar is never the only one on screen
      // for long and never the second one.
      setPastHero(window.scrollY > window.innerHeight * 0.62);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
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

        {(primaryCta || cta) && (
          <div className="navbar__cta">
            {primaryCta && (
              <span
                className="navbar__cta-primary"
                data-deferred={deferCta && !pastHero ? 'true' : undefined}
              >
                {primaryCta}
              </span>
            )}
            {cta}
          </div>
        )}

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

          {(primaryCta || cta) && (
            <div className="navbar__mobile-cta" onClick={close}>
              {primaryCta}
              {cta}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
