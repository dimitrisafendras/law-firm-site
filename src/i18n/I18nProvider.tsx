import {
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  DEFAULT_LANG,
  I18nContext,
  interpolate,
  readStoredLang,
  resources,
  STORAGE_KEY,
  syncDocumentLang,
  type I18nContextValue,
  type Lang,
  type TFunction,
} from './index';
import {
  getOverride,
  getOverridesVersion,
  getServerOverridesVersion,
  subscribeOverrides,
} from './overrides';

// The active language lives in localStorage — an external store — so we read it
// with useSyncExternalStore. This is what makes prerendering safe: on the server
// (and on the client's first, hydration render) React uses getServerSnapshot ->
// DEFAULT_LANG, which matches the prerendered 'en' HTML exactly, so there is no
// hydration mismatch. Immediately after hydration React re-reads the client
// snapshot and switches to the saved language. A Greek-preference user therefore
// sees a brief flash of English before the switch — an accepted trade-off for
// prerendering.

const langListeners = new Set<() => void>();

function subscribeLang(callback: () => void): () => void {
  langListeners.add(callback);
  // Also reflect changes made in other tabs.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    langListeners.delete(callback);
    window.removeEventListener('storage', onStorage);
  };
}

/** Client snapshot: the value persisted in localStorage (falls back to 'en'). */
function getLangSnapshot(): Lang {
  return readStoredLang();
}

/** Server/hydration snapshot: always the default, matching prerendered HTML. */
function getServerLangSnapshot(): Lang {
  return DEFAULT_LANG;
}

function persistLang(next: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* Ignore storage failures (e.g. private browsing). */
  }
  // Notify same-tab subscribers (the storage event only fires in other tabs).
  for (const listener of langListeners) listener();
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(
    subscribeLang,
    getLangSnapshot,
    getServerLangSnapshot,
  );

  const setLang = useCallback((next: Lang) => {
    persistLang(next);
    syncDocumentLang(next);
  }, []);

  // Keep <html lang> in sync with the active language, including the post-mount
  // switch to a saved non-default language. Syncing an external system (the
  // document element) is a legitimate effect.
  useEffect(() => {
    syncDocumentLang(lang);
  }, [lang]);

  // Admin-authored overrides live in an external store so a save re-renders
  // every consumer of t(). The version is a primitive snapshot, used only to
  // invalidate the memo below.
  const overridesVersion = useSyncExternalStore(
    subscribeOverrides,
    getOverridesVersion,
    getServerOverridesVersion,
  );

  const t = useCallback<TFunction>(
    (key, params) => {
      // Admin override, then current language, then English fallback, then the
      // key itself.
      const value =
        getOverride(lang, key) ??
        (resources[lang] as Record<string, string>)[key] ??
        (resources.en as Record<string, string>)[key] ??
        key;
      return interpolate(value, params);
    },
    // overridesVersion is intentionally a dependency: it carries no data, it
    // exists to rebuild t() when the external override store changes. Without
    // it, an admin's save would not re-render anything.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang, overridesVersion],
  );

  const value = useMemo<I18nContextValue>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
