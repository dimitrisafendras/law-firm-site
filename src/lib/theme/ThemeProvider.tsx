import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  DEFAULT_MODE_ID,
  DEFAULT_PALETTE_ID,
  STATUE_AUTO,
  isModeId,
  isPaletteId,
  isStatueChoice,
  modes,
  paletteById,
  palettes,
  statues,
} from '@/theme';
import type { ModeId, StatueChoice } from '@/theme';
import { MODE_STORAGE_KEY, STATUE_STORAGE_KEY, ThemeContext, THEME_STORAGE_KEY } from './context';
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

function readStoredMode(): ModeId {
  // Same reasoning as the palette: the default look is what bare `:root`
  // renders, so it is what the prerender and the first client render agree on.
  if (typeof window === 'undefined') return DEFAULT_MODE_ID;
  try {
    const stored = window.localStorage.getItem(MODE_STORAGE_KEY);
    return isModeId(stored) ? stored : DEFAULT_MODE_ID;
  } catch {
    return DEFAULT_MODE_ID;
  }
}

function readStoredStatue(): StatueChoice {
  if (typeof window === 'undefined') return STATUE_AUTO;
  try {
    const stored = window.localStorage.getItem(STATUE_STORAGE_KEY);
    return isStatueChoice(stored) ? stored : STATUE_AUTO;
  } catch {
    return STATUE_AUTO;
  }
}

/**
 * The palette the site is wearing, the look it is wearing it in, and the
 * statue the reader may have pinned over both.
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
 * The mode — digital or classic — is applied the same way, as `data-mode`, and
 * for the same reason. Both looks are always in the markup; the stylesheets
 * decide which one paints. (DigitalStatue is the one component that reads the
 * mode, and it does so inside an effect, so its rendered markup never differs.)
 *
 * ── Why an inline script owns the first paint ────────────────────────────────
 *
 * This provider cannot set the attributes early enough. React boots after the
 * stylesheet has already painted the document in the default palette, so a
 * visitor who chose Marble would see a flash of Obsidian first. The small
 * script at the top of index.html reads the same localStorage keys and stamps
 * both attributes before the first paint; this provider is the React-side
 * mirror of those values, and re-stamps them on every change.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Read during the initial render rather than in an effect: the value is
  // already on <html> by now (the inline script put it there), so an effect
  // would only re-render to reach the state we can read synchronously.
  const [id, setId] = useState(readStored);
  const [mode, setModeState] = useState<ModeId>(readStoredMode);
  const [statue, setStatueState] = useState<StatueChoice>(readStoredStatue);

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

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  useEffect(() => {
    // `auto` is the ABSENCE of the attribute: the generated stylesheet's
    // `[data-statue]` rules are pins, and with none present the palette and
    // look rules decide again.
    const root = document.documentElement;
    if (statue === STATUE_AUTO) delete root.dataset.statue;
    else root.dataset.statue = statue;
  }, [statue]);

  const setPalette = useCallback((next: string) => {
    if (!isPaletteId(next)) return;
    setId(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Preference simply does not persist; the switch still works this session.
    }
  }, []);

  const setMode = useCallback((next: string) => {
    if (!isModeId(next)) return;
    setModeState(next);
    try {
      window.localStorage.setItem(MODE_STORAGE_KEY, next);
    } catch {
      // As above.
    }
  }, []);

  const setStatue = useCallback((next: string) => {
    if (!isStatueChoice(next)) return;
    setStatueState(next);
    try {
      if (next === STATUE_AUTO) window.localStorage.removeItem(STATUE_STORAGE_KEY);
      else window.localStorage.setItem(STATUE_STORAGE_KEY, next);
    } catch {
      // As above.
    }
  }, []);

  const value = useMemo<ThemeState>(
    () => ({ palette, palettes, setPalette, mode, modes, setMode, statue, statues, setStatue }),
    [palette, setPalette, mode, setMode, statue, setStatue],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
