import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_PALETTE_ID, isPaletteId, paletteById, palettes } from '@/theme';
import { ThemeContext, THEME_STORAGE_KEY } from './context';
import type { ThemeState } from './context';

function readStored(): string {
  // No window during the prerender pass, and blocked site data throws on access
  // in private windows. The default palette is the right answer in both cases:
  // it is the one emitted into bare `:root`, so the prerendered HTML and the
  // client's first render agree.
  if (typeof window === 'undefined') return DEFAULT_PALETTE_ID;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isPaletteId(stored) ? stored : DEFAULT_PALETTE_ID;
  } catch {
    return DEFAULT_PALETTE_ID;
  }
}

/**
 * The palette the site is wearing.
 *
 * ── Why the attribute, and not React ─────────────────────────────────────────
 *
 * The palette is 45 CSS custom properties on `<html>`, switched by setting
 * `data-theme`. Nothing about it passes through the React tree, which is what
 * keeps a palette change from re-rendering the page: the browser recalculates
 * style and the paint changes, but no component runs again. It also means the
 * prerendered HTML is palette-agnostic — there is no themed markup to mismatch
 * during hydration.
 *
 * ── Why an inline script owns the first paint ────────────────────────────────
 *
 * This provider cannot set the attribute early enough. React boots after the
 * stylesheet has already painted the document in the default palette, so a
 * visitor who chose Marble would see a flash of Obsidian first. The small
 * script at the top of index.html reads the same localStorage key and stamps
 * the attribute before the first paint; this provider is the React-side mirror
 * of that value, and re-stamps it on every change.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Read during the initial render rather than in an effect: the value is
  // already on <html> by now (the inline script put it there), so an effect
  // would only re-render to reach the state we can read synchronously.
  const [id, setId] = useState(readStored);

  const palette = paletteById(id);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = palette.id;

    // The browser paints its own chrome — the address bar on mobile, the title
    // bar in an installed PWA — from this, so a palette that does not update it
    // leaves a navy strip above a cream page.
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = palette.colors.background;
  }, [palette]);

  const setPalette = useCallback((next: string) => {
    if (!isPaletteId(next)) return;
    setId(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Preference simply does not persist; the switch still works this session.
    }
  }, []);

  const value = useMemo<ThemeState>(
    () => ({ palette, palettes, setPalette }),
    [palette, setPalette],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
