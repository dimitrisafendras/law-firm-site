import { useCallback, useRef } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/lib/theme';
import './ThemePicker.css';

/**
 * The twelve palettes as a grid of swatches.
 *
 * ── Why a radiogroup and not a listbox ───────────────────────────────────────
 *
 * The choice applies the instant it is made and there is no confirm step, so
 * this is a set of radio buttons in behaviour as well as in name: arrow keys
 * move between them, and only the selected one is a tab stop. A listbox would
 * imply a value that is committed on close.
 *
 * ── Why each swatch names its palette ────────────────────────────────────────
 *
 * Colour is the whole point of the control and is also the one thing a
 * colour-blind or screen-reader user cannot get from it, so every swatch
 * carries its palette's proper noun ("Marble", "Verdigris") as visible text.
 * The three colour bands inside are decorative and `aria-hidden`.
 */
export function PaletteSwatches({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  const { palette: active, palettes, setPalette } = useTheme();

  const groupRef = useRef<HTMLDivElement>(null);

  /*
   * Arrow keys move the selection, which is what a radiogroup does — moving
   * focus without selecting would leave the group's checked state and the
   * user's focus disagreeing, and there is no commit step here to reconcile
   * them. Home/End jump to the ends. The grid is two rows of five on a wide
   * menu and one column on a narrow one, so up/down are treated as previous
   * and next rather than as a row jump: a fixed ±5 would be wrong in the
   * single-column layout, and reading the real column count out of the
   * computed grid to branch on it is more machinery than the control is worth.
   */
  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const index = palettes.findIndex((p) => p.id === active.id);
      let next = -1;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          next = (index + 1) % palettes.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          next = (index - 1 + palettes.length) % palettes.length;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = palettes.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      // Stop the arrow from also reaching the menu that hosts this group, which
      // runs its own key handling, and from scrolling the page.
      event.stopPropagation();
      setPalette(palettes[next].id);
      const swatches = groupRef.current?.querySelectorAll<HTMLButtonElement>('.palette-swatch');
      swatches?.[next]?.focus();
    },
    [active.id, palettes, setPalette],
  );

  return (
    <div
      ref={groupRef}
      className={`palette-swatches ${className}`.trim()}
      role="radiogroup"
      aria-label={t('themePickerLegend')}
      onKeyDown={onKeyDown}
    >
      {palettes.map((palette) => {
        const selected = palette.id === active.id;
        return (
          <button
            key={palette.id}
            type="button"
            role="radio"
            aria-checked={selected}
            // Only the selected swatch is in the tab order; the arrow keys move
            // within the group. This is the roving-tabindex pattern a
            // radiogroup is expected to implement.
            tabIndex={selected ? 0 : -1}
            className={`palette-swatch ${selected ? 'is-selected' : ''}`.trim()}
            onClick={() => setPalette(palette.id)}
            style={
              {
                '--swatch-ground': palette.colors.background,
                '--swatch-accent': palette.colors.accent,
                '--swatch-secondary': palette.colors.secondary,
              } as CSSProperties
            }
          >
            <span className="palette-swatch__chip" aria-hidden="true">
              <span className="palette-swatch__band palette-swatch__band--ground" />
              <span className="palette-swatch__band palette-swatch__band--accent" />
              <span className="palette-swatch__band palette-swatch__band--secondary" />
            </span>
            <span className="palette-swatch__label">{palette.label}</span>
          </button>
        );
      })}
    </div>
  );
}
