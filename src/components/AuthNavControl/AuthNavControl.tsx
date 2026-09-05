import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth';
import './AuthNavControl.css';

/**
 * The navbar's auth affordance: a sign-in link when signed out, a link to the
 * account page when signed in.
 *
 * Renders nothing while the session is still resolving. That avoids the flash
 * of a "Sign In" button in front of a user who is already authenticated —
 * `loading` stays true until the first session read completes.
 */
export function AuthNavControl() {
  const { t } = useTranslation();
  const { loading, user, profile, isAdmin } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <a className="auth-nav auth-nav--signin" href="#login">
        {t('authLogin')}
      </a>
    );
  }

  // Prefer the local part of the address: full emails are long enough to wrap
  // the navbar at tablet widths.
  const label = (profile?.email ?? user.email ?? '').split('@')[0] || t('authAccountTitle');

  return (
    <a className="auth-nav auth-nav--account" href="#account">
      <span className="auth-nav__name">{label}</span>
      {isAdmin && <span className="auth-nav__badge">{t('authRoleAdmin')}</span>}
    </a>
  );
}
