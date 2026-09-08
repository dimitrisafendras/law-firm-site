import { createContext } from 'react';
import type { Palette } from '@/theme';

export interface ThemeState {
  /** The active palette, resolved — never null, never an unknown id. */
  palette: Palette;
  /** All ten, in menu order. */
  palettes: Palette[];
  /** Switch palettes. An unknown id is ignored rather than applied. */
  setPalette(id: string): void;
}

/** Kept out of the provider module so that file exports only a component,
 *  which is what Fast Refresh needs to hot-reload it reliably. */
export const ThemeContext = createContext<ThemeState | null>(null);

/**
 * Where the choice is persisted.
 *
 * Read in two places: here, and by the inline script in index.html that runs
 * before first paint. Change it and you must change it there too — the constant
 * cannot be imported into an inline script.
 */
export const THEME_STORAGE_KEY = 'law-firm-site:palette';
