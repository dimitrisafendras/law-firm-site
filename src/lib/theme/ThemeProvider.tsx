import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  CONTINUUM_LENGTH,
  DEFAULT_MODE_ID,
  DEFAULT_PALETTE_ID,
  FONT_AUTO,
  STATUE_AUTO,
  fontOptions,
  isFontChoice,
  isModeId,
  isPaletteId,
  isStatueChoice,
  modes,
  paletteById,
  palettes,
  rungAddress,
  statues,
} from '@/theme';
import type { FontChoice, ModeId, StatueChoice } from '@/theme';
import {
  FONT_STORAGE_KEY,
  MODE_STORAGE_KEY,
  RUNG_STORAGE_KEY,
  STATUE_STORAGE_KEY,
  ThemeContext,
  THEME_STORAGE_KEY,
} from './context';
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

function readStoredFont(): FontChoice {
  if (typeof window === 'undefined') return FONT_AUTO;
  try {
    const stored = window.localStorage.getItem(FONT_STORAGE_KEY);
    return isFontChoice(stored) ? stored : FONT_AUTO;
  } catch {
    return FONT_AUTO;
  }
}

/**
 * The rung a palette sits on when nothing has been chosen: its own end of the
 * ladder. A dark palette is rung 0 and a light one the last rung, so a reader
 * who never touches the slider gets exactly the palette they picked.
 */
function defaultRung(scheme: string): number {
  return scheme === 'light' ? CONTINUUM_LENGTH - 1 : 0;
}

function readStoredRung(paletteScheme: string): number {
  if (typeof window === 'undefined') return defaultRung(paletteScheme);
  try {
    const stored = Number.parseInt(window.localStorage.getItem(RUNG_STORAGE_KEY) ?? '', 10);
    if (!Number.isInteger(stored) || stored < 0 || stored >= CONTINUUM_LENGTH) {
      return defaultRung(paletteScheme);
    }
    return stored;
  } catch {
    return defaultRung(paletteScheme);
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
  const [font, setFontState] = useState<FontChoice>(readStoredFont);
  // Seeded from the palette that was read above, so the pair (palette, rung) is
  // consistent on the very first render rather than after a correcting effect.
  const [rung, setRungState] = useState<number>(() => readStoredRung(paletteById(id).scheme));

  const palette = paletteById(id);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = palette.id;

    // `data-step` is the distance from the palette's own end of the ladder, and
    // step 0 is the ABSENCE of the attribute: the generator emits no block for
    // it, because that block is the palette's own.
    const { step } = rungAddress(rung);
    if (step === 0) delete root.dataset.step;
    else root.dataset.step = String(step);

    // The browser paints its own chrome — the address bar on mobile, the title
    // bar in an installed PWA — from this, so a palette that does not update it
    // leaves a navy strip above a cream page.
    // Read back from the cascade rather than from `palette.colors`: on a rung
    // other than the palette's own, the painted ground is the generated rung
    // block's, and browser chrome that tracked the endpoint instead would leave
    // a strip of the wrong colour above the page.
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) {
      const painted = getComputedStyle(root).getPropertyValue('--bg').trim();
      meta.content = painted || palette.colors.background;
    }
  }, [palette, rung]);

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

  useEffect(() => {
    // Same story as the statue pin: `auto` is the absence of `data-font`, so
    // the active look's own `--sans`/`--heading`/`--label` decide.
    const root = document.documentElement;
    if (font === FONT_AUTO) delete root.dataset.font;
    else root.dataset.font = font;
  }, [font]);

  const setPalette = useCallback((next: string) => {
    if (!isPaletteId(next)) return;
    const chosen = paletteById(next);
    const home = defaultRung(chosen.scheme);
    setId(next);
    // Picking a palette from the grid returns the slider to that palette's own
    // end. Keeping the old rung would mean choosing "Porcelain" and getting a
    // derived rung of it, which is not what the swatch showed.
    setRungState(home);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
      window.localStorage.setItem(RUNG_STORAGE_KEY, String(home));
    } catch {
      // Preference simply does not persist; the switch still works this session.
    }
  }, []);

  const setRung = useCallback(
    (next: number) => {
      const index = Math.max(0, Math.min(CONTINUUM_LENGTH - 1, Math.round(next)));
      const current = paletteById(id);
      const { id: side } = rungAddress(index);

      // A rung belongs to one end of the pair. Crossing the gap therefore also
      // changes which palette is selected — the ladder is one object to the
      // reader, but two palettes plus their derived rungs underneath.
      const wantsLight = side === 'light';
      const target = wantsLight === (current.scheme === 'light') ? current : paletteById(current.pair);

      setId(target.id);
      setRungState(index);
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, target.id);
        window.localStorage.setItem(RUNG_STORAGE_KEY, String(index));
      } catch {
        // As above.
      }
    },
    [id],
  );

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

  const setFont = useCallback((next: string) => {
    if (!isFontChoice(next)) return;
    setFontState(next);
    try {
      if (next === FONT_AUTO) window.localStorage.removeItem(FONT_STORAGE_KEY);
      else window.localStorage.setItem(FONT_STORAGE_KEY, next);
    } catch {
      // As above.
    }
  }, []);

  const value = useMemo<ThemeState>(
    () => ({
      palette,
      palettes,
      setPalette,
      mode,
      modes,
      setMode,
      statue,
      statues,
      setStatue,
      rung,
      setRung,
      font,
      fontOptions,
      setFont,
    }),
    [palette, setPalette, mode, setMode, statue, setStatue, rung, setRung, font, setFont],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
