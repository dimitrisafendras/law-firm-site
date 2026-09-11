import { useCallback, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/lib/theme';
import { ModeGlyph } from './glyphs';
import './LookPicker.css';

/**
 * The two looks, digital and classic, as a radiogroup — one row per mode with
 * a glyph, the label, and a one-line hint underneath.
 *
 * Modelled directly on `PaletteSwatches`: applies instantly with no confirm
 * step, so it is a radiogroup with roving tabindex rather than a listbox, and
 * arrow keys move the selection along with focus for the same reason a
 * listbox would misrepresent the interaction.
 */
export function ModeOptions() {
  const { t } = useTranslation();
  const { mode: active, modes, setMode } = useTheme();

  const groupRef = useRef<HTMLDivElement>(null);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const count = modes.length;
      const index = modes.findIndex((m) => m.id === active);
      const wrap = (n: number) => ((n % count) + count) % count;
      let next = -1;

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          next = wrap(index + 1);
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          next = wrap(index - 1);
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
      // Stop the arrow reaching a menu that hosts this group and runs its own
      // key handling, and from scrolling the page — same guard PaletteSwatches
      // uses for the same reason.
      event.stopPropagation();
      setMode(modes[next].id);
      const rows = groupRef.current?.querySelectorAll<HTMLButtonElement>('.look-options__row');
      rows?.[next]?.focus();
    },
    [active, modes, setMode],
  );

  return (
    <div
      ref={groupRef}
      className="look-options"
      role="radiogroup"
      aria-label={t('modePickerLegend')}
      onKeyDown={onKeyDown}
    >
      {modes.map((mode) => {
        const selected = mode.id === active;
        return (
          <button
            key={mode.id}
            type="button"
            role="radio"
            aria-checked={selected}
            // Roving tabindex: only the selected row is a tab stop, matching
            // `.palette-chip` — arrow keys move the selection so the focused
            // row and the checked row never disagree.
            tabIndex={selected ? 0 : -1}
            className={`look-options__row ${selected ? 'is-selected' : ''}`.trim()}
            onClick={() => setMode(mode.id)}
          >
            <span className="look-options__glyph">
              <ModeGlyph mode={mode.id} />
            </span>
            <span className="look-options__body">
              <span className="look-options__label">{t(mode.labelKey)}</span>
              <span className="look-options__hint">{t(mode.hintKey)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
