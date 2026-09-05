import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/lib/auth';
import { useEditMode } from '@/lib/edit-mode';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import './AuthNavControl.css';

/** Two letters from the address: "dimitris.afendras@…" → "DA". */
function initialsOf(email: string): string {
  const local = email.split('@')[0] ?? '';
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return local.slice(0, 2).toUpperCase() || '?';
}

/**
 * Navbar identity control: a sign-in link when signed out, an avatar with a
 * settings menu when signed in.
 *
 * Renders nothing while the session resolves, so an authenticated viewer never
 * sees a flash of "Sign In".
 */
export function AuthNavControl() {
  const { t, lang, setLang } = useTranslation();
  const { loading, user, profile, isAdmin, signOut } = useAuth();
  const { enabled, toggle } = useEditMode();

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  if (loading) return null;

  if (!user) {
    return (
      <div className="auth-nav auth-nav--anon">
        <LanguageSwitcher />
        <a className="auth-nav__signin" href="#login">
          {t('authLogin')}
        </a>
      </div>
    );
  }

  const otherLanguage = lang === 'en' ? 'EL' : 'EN';
  // setLang persists and syncs <html lang> itself.
  const switchLanguage = () => setLang(lang === 'en' ? 'el' : 'en');

  const email = profile?.email ?? user.email ?? '';

  return (
    <div className="auth-nav" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`auth-nav__avatar ${isAdmin ? 'auth-nav__avatar--admin' : ''}`.trim()}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('menuOpen')}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">{initialsOf(email)}</span>
      </button>

      {open && (
        <div className="auth-nav__menu glass" role="menu">
          <div className="auth-nav__identity">
            <span className="auth-nav__email">{email}</span>
            <span className="auth-nav__role">
              {isAdmin ? t('authRoleAdmin') : t('authRoleUser')}
            </span>
          </div>

          <div className="auth-nav__divider" />

          <button
            type="button"
            role="menuitem"
            className="auth-nav__item"
            onClick={switchLanguage}
          >
            <span>{t('menuLanguage')}</span>
            <span className="auth-nav__lang" aria-hidden="true">{otherLanguage}</span>
          </button>

          {isAdmin && (
            <>
              {/* A switch, not a menuitem: it changes state in place rather
                  than navigating, so it stays open after being toggled. */}
              <button
                type="button"
                role="menuitemcheckbox"
                aria-checked={enabled}
                className="auth-nav__item auth-nav__item--switch"
                onClick={toggle}
              >
                <span>{t('menuEditMode')}</span>
                <span className={`auth-nav__switch ${enabled ? 'is-on' : ''}`.trim()} aria-hidden="true">
                  <span className="auth-nav__switch-thumb" />
                </span>
              </button>

              <a className="auth-nav__item" role="menuitem" href="#admin-users" onClick={close}>
                {t('navAdminUsers')}
              </a>
            </>
          )}

          <a className="auth-nav__item" role="menuitem" href="#account" onClick={close}>
            {t('authAccountTitle')}
          </a>

          <div className="auth-nav__divider" />

          <button
            type="button"
            role="menuitem"
            className="auth-nav__item auth-nav__item--danger"
            onClick={() => {
              setOpen(false);
              void signOut();
              window.location.hash = '';
            }}
          >
            {t('authLogout')}
          </button>
        </div>
      )}
    </div>
  );
}
