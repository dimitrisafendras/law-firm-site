import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { I18nProvider } from './I18nProvider';
import { useTranslation } from './index';
import en from './locales/en';
import el from './locales/el';

// jsdom's default localStorage has no working methods under the opaque origin,
// so provide a minimal in-memory mock to exercise persistence.
function createStorageMock() {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => {
      store[k] = v;
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    clear: () => {
      store = {};
    },
  };
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <I18nProvider>{children}</I18nProvider>
);

describe('useTranslation', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createStorageMock());
    document.documentElement.lang = '';
  });

  it('resolves a key in English by default and syncs <html lang>', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.lang).toBe('en');
    expect(result.current.t('navContact')).toBe(en.navContact);
    expect(document.documentElement.lang).toBe('en');
  });

  it('switches language, re-resolves keys, and persists to localStorage', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    act(() => result.current.setLang('el'));

    expect(result.current.lang).toBe('el');
    expect(result.current.t('navContact')).toBe(el.navContact);
    expect(document.documentElement.lang).toBe('el');
    expect(localStorage.getItem('lang')).toBe('el');
  });

  it('reads the saved language from localStorage on init', () => {
    localStorage.setItem('lang', 'el');
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.lang).toBe('el');
    expect(result.current.t('navContact')).toBe(el.navContact);
  });

  it('interpolates {{placeholders}}', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.t('themeLabel', { mode: 'dark' })).toBe('Theme: dark. Click to change.');
  });

  it('falls back to the key itself for unknown keys', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.t('doesNotExist')).toBe('doesNotExist');
  });
});
