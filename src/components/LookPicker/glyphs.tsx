/**
 * Small `currentColor` glyphs shared between the row options and the trigger
 * buttons, so a look's icon is drawn once regardless of which control shows it.
 *
 * All three are decorative — the visible label or `aria-label` beside them
 * carries the meaning — so every glyph is `aria-hidden`.
 */

import type { ModeId } from '@/theme';

/** A circuit trace bending into a node: the digital look in miniature. */
function DigitalGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2.5 13.5H7V7.5H14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="2.5" cy="13.5" r="1.4" fill="currentColor" />
      <circle cx="14" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** A tiny Doric column — fluted shaft between a base and a capital slab. */
function ClassicGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="4" y="2.5" width="10" height="1.8" fill="currentColor" />
      <rect x="5" y="4.6" width="8" height="8.8" stroke="currentColor" strokeWidth="1.1" />
      <line x1="7" y1="4.6" x2="7" y2="13.4" stroke="currentColor" strokeWidth="0.7" />
      <line x1="9" y1="4.6" x2="9" y2="13.4" stroke="currentColor" strokeWidth="0.7" />
      <line x1="11" y1="4.6" x2="11" y2="13.4" stroke="currentColor" strokeWidth="0.7" />
      <rect x="4" y="13.4" width="10" height="1.8" fill="currentColor" />
    </svg>
  );
}

/** The current look's glyph, for the row list and the `ModePicker` trigger. */
export function ModeGlyph({ mode }: { mode: ModeId }) {
  return mode === 'classic' ? <ClassicGlyph /> : <DigitalGlyph />;
}

/** Scales of justice — the `StatuePicker` trigger's fixed glyph. It stands for
 *  the control itself, not for whichever statue happens to be pinned, so it
 *  never changes with the selection (unlike `ModeGlyph` on the mode trigger). */
export function ScalesGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <line x1="9" y1="2" x2="9" y2="14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="3" y1="4.2" x2="15" y2="4.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path
        d="M3 4.2 L1 8.6 A2.2 2.2 0 0 0 5 8.6 Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M15 4.2 L13 8.6 A2.2 2.2 0 0 0 17 8.6 Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="5.5" y1="16" x2="12.5" y2="16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
