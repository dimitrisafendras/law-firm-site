import { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from '@/i18n';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ProviderButtons } from '@/components/ProviderButtons';
import { authProviders } from '@/lib/auth/providers';
import { useAuth } from '@/lib/auth/useAuth';
import './AuthForm.css';

const MIN_PASSWORD_LENGTH = 8;

type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  mode: AuthMode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const { t } = useTranslation();
  const { session, signInWithPassword, signUpWithPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [noticeKey, setNoticeKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === 'signup';
  const hasProviders = authProviders.some((provider) => provider.enabled);
  const fieldId = (name: string) => `auth-${mode}-${name}`;

  // Signup with email confirmation disabled yields a session right away —
  // in that case skip the "check your inbox" notice and go to the account page.
  useEffect(() => {
    if (noticeKey && session) {
      window.location.hash = '#account';
    }
  }, [noticeKey, session]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setErrorKey(null);
    setNoticeKey(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorKey('authErrorPasswordShort');
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setErrorKey('authErrorPasswordMismatch');
      return;
    }

    setSubmitting(true);
    const { error } = isSignup
      ? await signUpWithPassword(email, password)
      : await signInWithPassword(email, password);
    setSubmitting(false);

    if (error) {
      setErrorKey(error);
      return;
    }

    if (isSignup) {
      setNoticeKey('authCheckEmail');
      return;
    }

    window.location.hash = '#account';
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form__fields">
        <Input
          id={fieldId('email')}
          label={t('authEmail')}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id={fieldId('password')}
          label={t('authPassword')}
          type="password"
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignup && (
          <Input
            id={fieldId('confirm')}
            label={t('authConfirmPassword')}
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
      </div>

      <div className="auth-form__status" aria-live="polite" aria-atomic="true">
        {errorKey && <p className="auth-form__error">{t(errorKey)}</p>}
        {noticeKey && <p className="auth-form__notice">{t(noticeKey)}</p>}
      </div>

      <Button type="submit" size="lg" className="auth-form__submit" disabled={submitting}>
        {t(isSignup ? 'authSubmitSignup' : 'authSubmitLogin')}
      </Button>

      {hasProviders && (
        <>
          <div className="auth-form__divider">
            <span className="auth-form__divider-label">{t('authOrContinueWith')}</span>
          </div>
          <ProviderButtons />
        </>
      )}

      <p className="auth-form__switch">
        <a className="auth-form__switch-link" href={isSignup ? '#login' : '#signup'}>
          {t(isSignup ? 'authSwitchToLogin' : 'authSwitchToSignup')}
        </a>
      </p>
    </form>
  );
}
