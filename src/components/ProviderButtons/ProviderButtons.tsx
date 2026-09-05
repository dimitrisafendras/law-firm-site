import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';
import { authProviders } from '@/lib/auth/providers';
import { useAuth } from '@/lib/auth/useAuth';
import './ProviderButtons.css';

export function ProviderButtons() {
  const { t } = useTranslation();
  const { signInWithProvider } = useAuth();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const enabledProviders = authProviders.filter((provider) => provider.enabled);

  if (enabledProviders.length === 0) {
    return null;
  }

  async function handleClick(id: string) {
    setPendingId(id);
    const { error } = await signInWithProvider(id);
    // On success the browser navigates to the provider, so only reset on failure.
    if (error) {
      setPendingId(null);
    }
  }

  return (
    <div className="provider-buttons">
      {enabledProviders.map((provider) => (
        <Button
          key={provider.id}
          type="button"
          variant="secondary"
          className="provider-buttons__button"
          disabled={pendingId !== null}
          aria-busy={pendingId === provider.id}
          onClick={() => void handleClick(provider.id)}
        >
          {t(provider.label)}
        </Button>
      ))}
    </div>
  );
}
