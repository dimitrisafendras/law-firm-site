import { createContext } from 'react';
import type { Mode, ModeId, Palette, Statue, StatueChoice } from '@/theme';

export interface ThemeState {
  /** The active palette, resolved — never null, never an unknown id. */
  palette: Palette;
  /** All eighteen, in menu order. */
  palettes: Palette[];
  /** Switch palettes. An unknown id is ignored rather than applied. */
  setPalette(id: string): void;
  /** The active look — digital or classic. See src/theme/modes.ts. */
  mode: ModeId;
  /** Both looks, in menu order. */
  modes: readonly Mode[];
  /** Switch looks. An unknown id is ignored rather than applied. */
  setMode(id: string): void;
  /**
   * The reader's statue pin, or `auto` — see src/theme/statues.ts. This is the
   * CHOICE, not the resolved artwork; `resolveStatue()` turns it into one.
   */
  statue: StatueChoice;
  /** The six artworks, in menu order. */
  statues: readonly Statue[];
  /** Pin a statue, or `auto` to let the palette and the look decide. */
  setStatue(id: string): void;
}

/** Kept out of the provider module so that file exports only a component,
 *  which is what Fast Refresh needs to hot-reload it reliably. */
export const ThemeContext = createContext<ThemeState | null>(null);

/**
 * Where the choices are persisted.
 *
 * Read in two places each: here, and by the inline script in index.html that
 * runs before first paint. Change one and you must change it there too — the
 * constants cannot be imported into an inline script.
 */
export const THEME_STORAGE_KEY = 'law-firm-site:palette';
export const MODE_STORAGE_KEY = 'law-firm-site:mode';
export const STATUE_STORAGE_KEY = 'law-firm-site:statue';
