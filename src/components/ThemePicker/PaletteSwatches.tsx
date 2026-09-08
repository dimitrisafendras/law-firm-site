import { useCallback, useRef } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { palettePairs, paletteRadioOrder } from '@/theme';
import type { Palette } from '@/theme';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/lib/theme';
import './ThemePicker.css';

/**
 * The sixteen palettes as eight scheme rows, each with a light and a dark chip.
 *
 * ── Why a row per scheme rather than a swatch per palette ────────────────────
 *
 * Every palette has an opposite-scheme twin, and laying the sixteen out as one
 * flat list hides that: it reads as sixteen unrelated choices, and the fact
 * that Sanctuary IS Obsidian in daylight has to be inferred from where the two
 * happen to sit. A row names the scheme once and puts its two versions side by
 * side, so choosing is two small decisions — which scheme, then how light —
 * rather than one decision among sixteen.
 *
 * ── Why a radiogroup and not a listbox ───────────────────────────────────────
 *
 * The choice applies the instant it is made and there is no confirm step, so
 * these are radio buttons in behaviour as well as in name: arrow keys move
 * between them, and only the selected one is a tab stop. A listbox would imply
 * a value committed on close.
 *
 * ── Naming ───────────────────────────────────────────────────────────────────
 *
 * The row's visible text is the scheme's family name ("Azure"), and each chip
 * is named by its palette's proper noun ("Sanctuary", "Obsidian") — unique
 * across all sixteen, so "Obsidian, radio, 2 of 16" is unambiguous without the
 * row heading having to be read too. The colour bands are decorative.
 */
export function PaletteSwatches({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  const { palette: active, setPalette } = useTheme();

  const groupRef = useRef<HTMLDivElement>(null);

  /*
   * Arrow keys move the selection, which is what a radiogroup does — moving
   * focus without selecting would leave the group's checked state and the
   * user's focus disagreeing, and there is no commit step to reconcile them.
   *
   * The grid is eight rows of two and `paletteRadioOrder` is in that same
   * reading order, so left/right are ±1 (flip this scheme between its light and
   * dark) and up/down are ±2 (same side, previous or next scheme). Home/End
   * jump to the ends. Everything wraps, so the group is always traversable.
   */
  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const count = paletteRadioOrder.length;
      const index = paletteRadioOrder.findIndex((p) => p.id === active.id);
      const wrap = (n: number) => ((n % count) + count) % count;
      let next = -1;

      switch (event.key) {
        case 'ArrowRight':
          next = wrap(index + 1);
          break;
        case 'ArrowLeft':
          next = wrap(index - 1);
          break;
        case 'ArrowDown':
          next = wrap(index + 2);
          break;
        case 'ArrowUp':
          next = wrap(index - 2);
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = count - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      // Stop the arrow from also reaching the menu that hosts this group, which
      // runs its own key handling, and from scrolling the page.
      event.stopPropagation();
      setPalette(paletteRadioOrder[next].id);
      const chips = groupRef.current?.querySelectorAll<HTMLButtonElement>('.palette-chip');
      chips?.[next]?.focus();
    },
    [active.id, setPalette],
  );

  const chip = (palette: Palette) => {
    const selected = palette.id === active.id;
    return (
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        // Only the selected chip is a tab stop; arrow keys move within the
        // group. The roving-tabindex pattern a radiogroup is expected to have.
        tabIndex={selected ? 0 : -1}
        aria-label={palette.label}
        className={`palette-chip ${selected ? 'is-selected' : ''}`.trim()}
        onClick={() => setPalette(palette.id)}
        style={
          {
            '--swatch-ground': palette.colors.background,
            '--swatch-accent': palette.colors.accent,
            '--swatch-secondary': palette.colors.secondary,
          } as CSSProperties
        }
      >
        <span className="palette-chip__bands" aria-hidden="true">
          <span className="palette-chip__band palette-chip__band--ground" />
          <span className="palette-chip__band palette-chip__band--accent" />
          <span className="palette-chip__band palette-chip__band--secondary" />
        </span>
      </button>
    );
  };

  return (
    <div
      ref={groupRef}
      className={`palette-swatches ${className}`.trim()}
      role="radiogroup"
      aria-label={t('themePickerLegend')}
      onKeyDown={onKeyDown}
    >
      {palettePairs.map((pair) => (
        <div
          key={pair.family}
          className={`palette-row ${active.family === pair.family ? 'is-active' : ''}`.trim()}
        >
          <span className="palette-row__chips">
            {chip(pair.light)}
            {chip(pair.dark)}
          </span>
          <span className="palette-row__family">{pair.family}</span>
        </div>
      ))}
    </div>
  );
}
