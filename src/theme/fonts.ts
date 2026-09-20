/**
 * The reader's typeface choice — a third axis alongside the palette and the
 * look, built the SAME way as the other two (see modes.ts and statues.ts for
 * the pattern this repeats): an attribute on `<html>` — `data-font` — stamped
 * before first paint by the inline script in index.html, mirrored into React
 * by ThemeProvider, and applied entirely in CSS.
 *
 * ── What it overrides ─────────────────────────────────────────────────────────
 * Exactly the three tokens the classic look already re-points — `--sans`,
 * `--heading` and `--label` — and nothing else. A font choice is a typeface,
 * not a look: it does not touch radii, type sizes/weights, caps tracking or
 * motion, all of which stay whatever the active look (digital or classic) has
 * set them to. Picking "GFS Didot" in the digital look therefore renders that
 * face at the digital look's own sizes and weights, poured-glass corners and
 * all; picking it in the classic look renders it at the classic look's sizes,
 * cut corners and all. The typeface and the look are independent, the way the
 * palette and the look already are.
 *
 * ── Why the default is the ABSENCE of the attribute ──────────────────────────
 * Like a statue pin (STATUE_AUTO) and unlike a look (which always stamps
 * `digital` or `classic`): there is no one "default face" to fall back to,
 * because the two looks already disagree about what the default is — bare
 * `:root` renders Jura, `:root[data-mode='classic']` renders EB Garamond. The
 * sentinel choice, `'auto'`, means "let the look decide", and ThemeProvider
 * removes the attribute entirely for it rather than stamping a value that
 * would have to duplicate whichever font the look already chose. The other
 * three choices are a reader's explicit override, and they win regardless of
 * look — see the generator note below for how that precedence is enforced.
 *
 * ── The three explicit choices ────────────────────────────────────────────────
 * `jura` and `garamond` set nothing this site has not already loaded: they are
 * the digital look's own sans and the classic look's own serif, made available
 * regardless of which look is active, using the family strings already in
 * `fonts` (tokens.ts) — no new font files, no new @font-face rules. `gfsDidot`
 * is the one genuinely new face: see the long comment on `fonts.didot` in
 * tokens.ts for what it is and why it was chosen, and src/index.css for its
 * @font-face blocks (self-hosted, latin + greek only — Google does not offer a
 * latin-ext subset for this face, and greek-ext is polytonic Greek this site
 * has no use for).
 *
 * ── Why this file imports no images and needs no such caveat ─────────────────
 * Unlike statues.ts, nothing here is unimportable from bare node — `tokens.ts`
 * is plain data — but the registry is still consumed directly by
 * scripts/generate-theme-css.mjs for the same reason as statues.ts: the
 * generator is the one place that turns "here is a font choice" into a
 * `:root[data-font='…']` block, and it does so from this list so that adding a
 * choice here is what makes it appear everywhere (the generated stylesheet,
 * the picker, the design-system page).
 *
 * ── Precedence against the classic look ───────────────────────────────────────
 * `:root[data-mode='classic']` and `:root[data-font='<id>']` are the same shape
 * of selector — one attribute on `:root` — so they carry equal specificity,
 * and the generator settles the tie by emitting the font blocks AFTER the
 * classic block. An explicit font choice therefore always wins over the look's
 * own default, in both looks, which is the reading a reader who opened this
 * control and picked a face would expect. `auto` needs no such tie-break: with
 * the attribute absent, only the classic (or bare) block ever applies.
 */

import { fonts } from './tokens.ts';

export type FontId = 'jura' | 'garamond' | 'gfsDidot';

/** A reader's font pin, or `auto` for "let the look decide". */
export type FontChoice = FontId | 'auto';

export interface FontOption {
  id: FontId;
  /** Translation key for the visible name. */
  labelKey: string;
  /** Translation key for the one-line description under the name. */
  hintKey: string;
  /** The three tokens this choice re-points — see the file header. */
  fonts: {
    sans: string;
    heading: string;
    label: string;
  };
}

export const fontOptions: readonly FontOption[] = [
  {
    id: 'jura',
    labelKey: 'fontJura',
    hintKey: 'fontJuraHint',
    fonts: { sans: fonts.sans, heading: fonts.heading, label: fonts.label },
  },
  {
    id: 'garamond',
    labelKey: 'fontGaramond',
    hintKey: 'fontGaramondHint',
    fonts: { sans: fonts.serif, heading: fonts.serif, label: fonts.serif },
  },
  {
    id: 'gfsDidot',
    labelKey: 'fontGfsDidot',
    hintKey: 'fontGfsDidotHint',
    fonts: { sans: fonts.didot, heading: fonts.didot, label: fonts.didot },
  },
];

export const FONT_AUTO: FontChoice = 'auto';

const ids = new Set<string>(fontOptions.map((f) => f.id));

export function isFontId(value: unknown): value is FontId {
  return typeof value === 'string' && ids.has(value);
}

export function isFontChoice(value: unknown): value is FontChoice {
  return value === 'auto' || isFontId(value);
}

export function fontOptionById(id: FontId): FontOption {
  return fontOptions.find((f) => f.id === id) ?? fontOptions[0];
}
