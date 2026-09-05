import { describe, expect, it } from 'vitest';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth';
import { useEditMode } from '@/lib/edit-mode';
import {
  createMockSupabaseClient,
  makeSession,
  renderWithProviders,
  screen,
  setMatchMedia,
  triggerIntersection,
} from './utils';

/**
 * Guards the test harness itself, so a broken helper fails here with a clear
 * message rather than as a confusing failure inside a feature test.
 */

function Probe() {
  const { t } = useTranslation();
  const { isAdmin, loading } = useAuth();
  const { enabled, canEdit } = useEditMode();

  return (
    <dl>
      <dd data-testid="lang">{t('navContact')}</dd>
      <dd data-testid="admin">{String(isAdmin)}</dd>
      <dd data-testid="loading">{String(loading)}</dd>
      <dd data-testid="enabled">{String(enabled)}</dd>
      <dd data-testid="canEdit">{String(canEdit)}</dd>
    </dl>
  );
}

describe('renderWithProviders', () => {
  it('renders a signed-out visitor with editing locked', () => {
    renderWithProviders(<Probe />);

    expect(screen.getByTestId('admin')).toHaveTextContent('false');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('canEdit')).toHaveTextContent('false');
  });

  it('gives an admin canEdit only once edit mode is unlocked', () => {
    const { unmount } = renderWithProviders(<Probe />, { auth: 'admin' });
    expect(screen.getByTestId('admin')).toHaveTextContent('true');
    expect(screen.getByTestId('canEdit')).toHaveTextContent('false');
    unmount();

    renderWithProviders(<Probe />, { auth: 'admin', editMode: true });
    expect(screen.getByTestId('canEdit')).toHaveTextContent('true');
  });

  it('never lets a non-admin edit, even with edit mode unlocked', () => {
    renderWithProviders(<Probe />, { auth: 'user', editMode: true });

    expect(screen.getByTestId('enabled')).toHaveTextContent('true');
    expect(screen.getByTestId('canEdit')).toHaveTextContent('false');
  });

  it('exposes the auth callbacks as spies', async () => {
    const { auth } = renderWithProviders(<Probe />, { auth: 'admin' });

    await auth.signOut();
    expect(auth.signOut).toHaveBeenCalledTimes(1);
  });

  it('renders Greek copy on request', () => {
    renderWithProviders(<Probe />, { language: 'el' });
    const greek = screen.getByTestId('lang').textContent ?? '';

    renderWithProviders(<Probe />, { language: 'en' });
    const english = screen.getAllByTestId('lang')[1]?.textContent ?? '';

    expect(greek).not.toBe('');
    expect(greek).not.toBe(english);
  });
});

describe('browser stubs', () => {
  it('defaults matchMedia to no match and lets a test override it', () => {
    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false);

    setMatchMedia((query) => query.includes('prefers-reduced-motion'));
    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
    expect(window.matchMedia('(max-width: 1024px)').matches).toBe(false);
  });

  it('fires IntersectionObserver callbacks on demand', () => {
    let seen = false;
    const observer = new IntersectionObserver((entries) => {
      seen = entries.some((entry) => entry.isIntersecting);
    });
    observer.observe(document.createElement('div'));

    expect(seen).toBe(false);
    triggerIntersection(true);
    expect(seen).toBe(true);
  });

  it('starts each test with empty localStorage', () => {
    expect(window.localStorage.getItem('lang')).toBeNull();
  });
});

describe('createMockSupabaseClient', () => {
  it('resolves a single row through select().eq().maybeSingle()', async () => {
    const row = { id: 'a', email: 'a@example.com', role: 'admin' };
    const mock = createMockSupabaseClient({ tables: { profiles: { rows: [row] } } });

    const result = await mock.client
      .from('profiles')
      .select('id, email, role')
      .eq('id', 'a')
      .maybeSingle();

    expect(result.data).toEqual(row);
    expect(result.error).toBeNull();
    expect(mock.reads).toEqual(['profiles']);
  });

  it('resolves a list by awaiting the builder', async () => {
    const rows = [{ key: 'navContact', locale: 'en', value: 'Contact' }];
    const mock = createMockSupabaseClient({ tables: { site_content: { rows } } });

    const { data, error } = await mock.client.from('site_content').select('key, locale, value');

    expect(error).toBeNull();
    expect(data).toEqual(rows);
  });

  it('records writes and can fail them', async () => {
    const mock = createMockSupabaseClient({
      tables: { site_content: { writeError: { message: 'nope', details: '', hint: '', code: '42501' } } },
    });

    const { error } = await mock.client
      .from('site_content')
      .upsert({ key: 'navContact' }, { onConflict: 'key,locale' });

    expect(error?.message).toBe('nope');
    expect(mock.writes).toEqual([
      {
        table: 'site_content',
        op: 'upsert',
        payload: { key: 'navContact' },
        options: { onConflict: 'key,locale' },
      },
    ]);
  });

  it('drives onAuthStateChange subscribers and tracks teardown', () => {
    const mock = createMockSupabaseClient();
    const seen: (string | null)[] = [];

    const {
      data: { subscription },
    } = mock.client.auth.onAuthStateChange((event) => {
      seen.push(event);
    });

    mock.emitAuthChange('SIGNED_IN', makeSession());
    expect(seen).toEqual(['SIGNED_IN']);
    expect(mock.allSubscriptionsClosed()).toBe(false);

    subscription.unsubscribe();
    expect(mock.allSubscriptionsClosed()).toBe(true);
  });
});
