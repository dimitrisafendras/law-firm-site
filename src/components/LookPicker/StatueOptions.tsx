import { useCallback, useMemo, useRef } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { STATUE_AUTO } from '@/theme';
import type { StatueId } from '@/theme';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/lib/theme';
import './LookPicker.css';

/**
 * The two tones a statue chip suggests the artwork with: the marble the figure
 * is carved from, and the colour its wireframe/rain is keyed to (see
 * `sceneColors.ts` and CLAUDE.md, "The hero statue").
 *
 * These are the one legitimate place raw colour values may appear in this
 * component — the same exemption `ThemePicker.css` documents for its
 * `--swatch-*` custom properties: the chip's whole job is to preview an
 * artwork the page is not currently wearing, so it cannot read the colour from
 * a token the active palette defines. They are not design tokens and must
 * never be reused as one.
 */
const STATUE_CHIPS: Record<StatueId, { stone: string; mesh: string }> = {
  cyan: { stone: '#E9E4DA', mesh: '#5FE3E0' },
  ultramarine: { stone: '#E9E4DA', mesh: '#89B3F0' },
  white: { stone: '#E9E4DA', mesh: '#EDEDED' },
  mono: { stone: '#BDBDBD', mesh: '#9A9A9A' },
  limestone: { stone: '#E9E4DA', mesh: '#E0B070' },
  classic: { stone: '#E9E4DA', mesh: '#C9A34A' },
};

/**
 * The reader's statue pin, as a radiogroup: "Follow the theme" first, then the
 * six artworks in registry order, each previewed by a two-tone chip.
 *
 * Modelled on `PaletteSwatches` and `ModeOptions` — a roving-tabindex
 * radiogroup rather than a listbox, because the pin applies the instant a row
 * is chosen.
 */
export function StatueOptions() {
  const { t } = useTranslation();
  const { statue: active, statues, setStatue } = useTheme();

  const groupRef = useRef<HTMLDivElement>(null);
  // 'auto' plus the six registry entries, in the order the rows render.
  // Memoized so useCallback below does not see a new array identity — and a
  // stale keydown handler — on every render.
  const ids = useMemo<readonly string[]>(() => [STATUE_AUTO, ...statues.map((s) => s.id)], [statues]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const count = ids.length;
      const index = ids.indexOf(active);
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
      // Same guard as PaletteSwatches/ModeOptions: keep the arrow from also
      // reaching the menu that hosts this group and from scrolling the page.
      event.stopPropagation();
      setStatue(ids[next]);
      const rows = groupRef.current?.querySelectorAll<HTMLButtonElement>('.look-options__row');
      rows?.[next]?.focus();
    },
    [active, ids, setStatue],
  );

  const chip = (id: string) => {
    const colors = id === STATUE_AUTO ? undefined : STATUE_CHIPS[id as StatueId];
    return (
      <span
        className="statue-options__chip"
        aria-hidden="true"
        style={
          colors
            ? ({ '--chip-stone': colors.stone, '--chip-mesh': colors.mesh } as CSSProperties)
            : undefined
        }
      >
        <span className="statue-options__chip-stone" />
        <span className="statue-options__chip-mesh" />
      </span>
    );
  };

  return (
    <div
      ref={groupRef}
      className="look-options"
      role="radiogroup"
      aria-label={t('statuePickerLegend')}
      onKeyDown={onKeyDown}
    >
      {ids.map((id, index) => {
        const selected = id === active;
        const isAuto = id === STATUE_AUTO;
        const statue = isAuto ? null : statues.find((s) => s.id === id) ?? null;
        const label = isAuto ? t('statueAuto') : t(statue!.labelKey);
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            className={`look-options__row ${selected ? 'is-selected' : ''}`.trim()}
            onClick={() => setStatue(id)}
          >
            {chip(ids[index])}
            <span className="look-options__body">
              <span className="look-options__label">{label}</span>
              {isAuto && <span className="look-options__hint">{t('statueAutoHint')}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
