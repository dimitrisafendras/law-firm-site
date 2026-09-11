/**
 * The site's two looks — the palette says what colour the page is, the mode
 * says what KIND of page it is.
 *
 * ── Digital ───────────────────────────────────────────────────────────────────
 * The site as it shipped: a marble figure dissolving into a wireframe, binary
 * rain, sparkles, fire in the scale pans, a circuit field behind everything,
 * geometric type, poured-glass corners. "Legacy and innovation" enacted as a
 * collision.
 *
 * ── Classic ───────────────────────────────────────────────────────────────────
 * The same page with the collision resolved in favour of the stone. The figure
 * is whole marble, nothing on the page is drawn as a circuit, the type is a
 * Garamond, corners are cut rather than poured, the decorative layer is a
 * meander frieze and fluted columns rather than traces and nodes, and every
 * entrance is a rise through light rather than a render resolving. The glass
 * material stays — it is the site's material, not the digital look's — and it
 * keeps every rule in CLAUDE.md about how it is used.
 *
 * ── How a mode is applied ─────────────────────────────────────────────────────
 * Exactly the way a palette is: an attribute on `<html>` — `data-mode` — that
 * the stylesheets key on, stamped before first paint by the inline script in
 * index.html and mirrored into React by ThemeProvider. Nothing about the mode
 * passes through the React tree, for the reason given at length in
 * statueArtwork.ts: the prerendered HTML must be mode-agnostic or hydration
 * silently keeps the server's markup. Both looks are therefore always in the
 * DOM, and CSS decides which is visible. The one React-side reader is
 * DigitalStatue, which reads the mode inside an effect (never in render) so
 * that the classic look does not pay for five canvas workers it never shows.
 *
 * `digital` is the default and is what bare `:root` renders, so it needs no
 * stylesheet block of its own; `classic` is the override, emitted by
 * scripts/generate-theme-css.mjs from the `classic` token set in tokens.ts.
 */

export type ModeId = 'digital' | 'classic';

export interface Mode {
  id: ModeId;
  /** Translation key for the visible name. */
  labelKey: string;
  /** Translation key for the one-line description under the name. */
  hintKey: string;
}

export const modes: readonly Mode[] = [
  { id: 'digital', labelKey: 'modeDigital', hintKey: 'modeDigitalHint' },
  { id: 'classic', labelKey: 'modeClassic', hintKey: 'modeClassicHint' },
];

export const DEFAULT_MODE_ID: ModeId = 'digital';

export function isModeId(value: unknown): value is ModeId {
  return value === 'digital' || value === 'classic';
}
