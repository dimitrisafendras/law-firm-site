import { createContext } from 'react';
import type { FontChoice, FontOption, Mode, ModeId, Palette, Statue, StatueChoice } from '@/theme';

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
  /**
   * Which rung of the family's light-to-dark ladder is showing, 0 being the
   * darkest. See src/theme/continuum.ts — and note that the ladder has a gap in
   * the middle that no rung fills, because no readable palette lives there.
   */
  rung: number;
  /** Move up or down the ladder. Crossing the gap also changes which of the
   *  pair's two palettes is selected, since a rung is addressed outward from
   *  whichever end it belongs to. */
  setRung(index: number): void;
  /**
   * The reader's typeface pin, or `auto` — see src/theme/fonts.ts. This is the
   * CHOICE, not the resolved family; `auto` means the active look's own font
   * shows, exactly like a statue's `auto`.
   */
  font: FontChoice;
  /** The three explicit choices, in menu order. */
  fontOptions: readonly FontOption[];
  /** Pin a typeface, or `auto` to let the look decide. */
  setFont(id: string): void;
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
/** The ladder rung. The inline script duplicates this key and the tiny bit of
 *  `rungAddress` it needs; see the note there. */
export const RUNG_STORAGE_KEY = 'law-firm-site:rung';
/** The font pin. Same "auto means absent" story as STATUE_STORAGE_KEY. */
export const FONT_STORAGE_KEY = 'law-firm-site:font';
