/**
 * The hero statue artworks, as a registry the palette and the reader can both
 * choose from.
 *
 * ── The artworks ──────────────────────────────────────────────────────────────
 * Five renders of one photograph, framed identically (see CLAUDE.md, "The hero
 * statue"): the dissolving figure with its wireframe re-coloured — cyan,
 * ultramarine, white, monochrome, limestone gold.
 *
 * There is no separate artwork for the classic look, and there was one
 * briefly. The figure's raised arm, its sword and one fall of drapery exist in
 * the source only as wireframe, so a marble version of the same render has to
 * INVENT that half, and every reconstruction of it read as a smooth blank
 * where the rest of the figure is carved. A look is a set of token overrides
 * and some ornament; it does not get to ship a worse photograph. Both looks
 * wear the same five artworks, and the classic one simply does not paint the
 * dissolution over them.
 *
 * ── Who chooses ───────────────────────────────────────────────────────────────
 * Today, nothing: every palette wears **ultramarine**. It is the entry with
 * `families: null`, which means "the remainder" — and since no other entry
 * claims a family, the remainder is all eighteen.
 *
 * The `families` mechanism is still here and still the way a palette would
 * claim an artwork; it just has nothing to say at the moment. Four lists in
 * `palettes.ts` used to pair the warm schemes with limestone, Amethyst with
 * white, Graphite with mono and Ultramarine with ultramarine, on the argument
 * in sceneColors.ts that a wireframe fights an accent it does not match. That
 * pairing is off: one drawing across the whole site, and the other four are
 * reachable deliberately rather than by side effect.
 *
 * Which is what a reader's pin is for. A pin from the header outranks the
 * family — stored under `law-firm-site:statue`, stamped on
 * `<html data-statue>` before first paint, mirrored into React by
 * ThemeProvider. `auto` is the absence of a pin: no attribute, and the
 * registry decides again.
 *
 * ── Why this file imports no images ───────────────────────────────────────────
 * scripts/generate-theme-css.mjs reads this registry in bare node to emit the
 * `background-image` swaps, and a module that imports images cannot be loaded
 * there. The image references live in the generator (by `base` name) and the
 * scene colours live beside the canvases in `sceneColors.ts`; this file is the
 * list both of them are keyed on.
 */

export type StatueId = 'cyan' | 'ultramarine' | 'white' | 'mono' | 'limestone';

/** A reader's pin, or `auto` for "let the palette decide". */
export type StatueChoice = StatueId | 'auto';

export interface Statue {
  id: StatueId;
  /** File-name stem under src/assets/images: `<base>-<width>.<ext>`. */
  base: string;
  /** Translation key for the visible name. */
  labelKey: string;
  /**
   * The palette families that wear this statue. `null` marks the remainder —
   * every family no other statue claims — and exactly one entry may be it.
   * `[]` means no palette wears this artwork and only a pin will show it.
   */
  families: readonly string[] | null;
}

export const statues: readonly Statue[] = [
  // `families: null` is the remainder, and with every other entry claiming
  // nothing the remainder is every palette. This one line is what makes
  // ultramarine the site's statue.
  {
    id: 'ultramarine',
    base: 'hero-statue-ultramarine',
    labelKey: 'statueUltramarine',
    families: null,
  },
  { id: 'cyan', base: 'hero-statue', labelKey: 'statueCyan', families: [] },
  { id: 'white', base: 'hero-statue-white', labelKey: 'statueWhite', families: [] },
  { id: 'mono', base: 'hero-statue-mono', labelKey: 'statueMono', families: [] },
  { id: 'limestone', base: 'hero-statue-limestone', labelKey: 'statueLimestone', families: [] },
];

export const STATUE_AUTO: StatueChoice = 'auto';

const ids = new Set<string>(statues.map((s) => s.id));

export function isStatueId(value: unknown): value is StatueId {
  return typeof value === 'string' && ids.has(value);
}

export function isStatueChoice(value: unknown): value is StatueChoice {
  return value === 'auto' || isStatueId(value);
}

export function statueById(id: StatueId): Statue {
  return statues.find((s) => s.id === id) ?? statues[0];
}

const claimed = new Set(statues.flatMap((s) => s.families ?? []));

/** The statue a palette family wears. */
export function statueForFamily(family: string): Statue {
  return (
    statues.find((s) => s.families?.includes(family)) ??
    statues.find((s) => s.families === null && !claimed.has(family)) ??
    statues[0]
  );
}

/**
 * Resolve what the hero actually shows: the pin if there is one, else the
 * family's. This is the same precedence the generated stylesheet encodes in
 * its rule order — a pinned `data-statue` rule is emitted after the palette
 * rules, and both are (0,2,1), so source order decides.
 *
 * The look does not appear here. It used to, and the reason it no longer does
 * is at the top of this file.
 */
export function resolveStatue(family: string, choice: StatueChoice): Statue {
  if (choice !== 'auto') return statueById(choice);
  return statueForFamily(family);
}
