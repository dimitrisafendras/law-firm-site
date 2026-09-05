import { createContext, useContext } from 'react';
import en from './locales/en';
import el from './locales/el';

export type Lang = 'en' | 'el';

/** Every valid translation key, derived from the English locale (source of truth). */
export type TranslationKey = keyof typeof en;

export const DEFAULT_LANG: Lang = 'en';
export const STORAGE_KEY = 'lang';

export const resources = { en, el } satisfies Record<Lang, Record<TranslationKey, string>>;

export function isLang(value: unknown): value is Lang {
  return value === 'en' || value === 'el';
}

export function readStoredLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isLang(saved) ? saved : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

export function syncDocumentLang(lang: Lang): void {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

/** Replace `{{name}}` placeholders with values from `params`. */
export function interpolate(value: string, params?: Record<string, string | number>): string {
  if (!params) return value;
  return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

/**
 * Translation function. Literal keys are autocompleted and type-checked; the
 * `(string & {})` arm keeps dynamically-built keys (e.g. `practice${key}Title`)
 * accepted without collapsing the type down to plain `string`.
 */
export type TFunction = (
  key: TranslationKey | (string & {}),
  params?: Record<string, string | number>,
) => string;

export interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TFunction;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within <I18nProvider>');
  }
  return ctx;
}
