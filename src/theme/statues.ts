/**
 * The hero statue artworks, as a registry the palette and the reader can both
 * choose from.
 *
 * ── The artworks ──────────────────────────────────────────────────────────────
 * Six renders of one photograph, framed identically (see CLAUDE.md, "The hero
 * statue"). Five are the dissolving figure with its wireframe re-coloured —
 * cyan, ultramarine, white, monochrome, limestone gold — and one, `classic`,
 * is the figure made whole: the wireframe and the cube debris rebuilt as
 * marble, so nothing about it is digital. The classic look wears that one by
 * default; the digital look picks between the other five by palette family.
 *
 * ── Who chooses ───────────────────────────────────────────────────────────────
 * By default nobody does: the palette's family decides (`families`), and the
 * classic look overrides the family with `classic`. A reader may also pin a
 * statue explicitly from the header, and that pin outranks both — it is stored
 * under `law-firm-site:statue`, stamped on `<html data-statue>` before first
 * paint, and mirrored into React by ThemeProvider. `auto` is the absence of a
 * pin: no attribute, and the family and the look decide again.
 *
 * ── Why this file imports no images ───────────────────────────────────────────
 * scripts/generate-theme-css.mjs reads this registry in bare node to emit the
 * `background-image` swaps, and a module that imports images cannot be loaded
 * there. The image references live in the generator (by `base` name) and the
 * scene colours live beside the canvases in `sceneColors.ts`; this file is the
 * list both of them are keyed on.
 */

import {
  LIMESTONE_STATUE_FAMILIES,
  MONO_STATUE_FAMILIES,
  ULTRAMARINE_STATUE_FAMILIES,
  WHITE_STATUE_FAMILIES,
} from './palettes.ts';

export type StatueId = 'cyan' | 'ultramarine' | 'white' | 'mono' | 'limestone' | 'classic';

/** A reader's pin, or `auto` for "let the palette and the look decide". */
export type StatueChoice = StatueId | 'auto';

export interface Statue {
  id: StatueId;
  /** File-name stem under src/assets/images: `<base>-<width>.<ext>`. */
  base: string;
  /** Translation key for the visible name. */
  labelKey: string;
  /**
   * The palette families that wear this statue in the digital look. `null`
   * marks the remainder — every family no other statue claims. `classic`
   * claims no family: it is the classic look's statue, not a palette's.
   */
  families: readonly string[] | null;
}

export const statues: readonly Statue[] = [
  { id: 'cyan', base: 'hero-statue', labelKey: 'statueCyan', families: null },
  {
    id: 'ultramarine',
    base: 'hero-statue-ultramarine',
    labelKey: 'statueUltramarine',
    families: ULTRAMARINE_STATUE_FAMILIES,
  },
  { id: 'white', base: 'hero-statue-white', labelKey: 'statueWhite', families: WHITE_STATUE_FAMILIES },
  { id: 'mono', base: 'hero-statue-mono', labelKey: 'statueMono', families: MONO_STATUE_FAMILIES },
  {
    id: 'limestone',
    base: 'hero-statue-limestone',
    labelKey: 'statueLimestone',
    families: LIMESTONE_STATUE_FAMILIES,
  },
  { id: 'classic', base: 'hero-statue-classic', labelKey: 'statueClassic', families: [] },
];

export const STATUE_AUTO: StatueChoice = 'auto';

/** The statue the classic look wears when nothing is pinned. */
export const CLASSIC_STATUE_ID: StatueId = 'classic';

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

/** The statue a palette family wears in the digital look. */
export function statueForFamily(family: string): Statue {
  return (
    statues.find((s) => s.families?.includes(family)) ??
    statues.find((s) => s.families === null && !claimed.has(family)) ??
    statues[0]
  );
}

/**
 * Resolve what the hero actually shows: the pin if there is one, else the
 * look's statue, else the family's. This is the same precedence the generated
 * stylesheet encodes in its rule order — a pinned `data-statue` rule is
 * emitted last, the classic-look rule before it, the palette rules first.
 */
export function resolveStatue(
  family: string,
  mode: 'digital' | 'classic',
  choice: StatueChoice,
): Statue {
  if (choice !== 'auto') return statueById(choice);
  if (mode === 'classic') return statueById(CLASSIC_STATUE_ID);
  return statueForFamily(family);
}
