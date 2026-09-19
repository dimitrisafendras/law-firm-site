import { useId } from 'react';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/lib/theme';
import { CONTINUUM_LENGTH, CONTINUUM_STEPS } from '@/theme';

/**
 * The light-to-dark ladder, as a slider.
 *
 * Sits under `PaletteSwatches` in all three of that grid's housings — the
 * header popover, the account menu and the design-system page — rather than
 * taking a fourth trigger in the header, which is already the widest
 * fixed-width row on the site and the only one that cannot reflow.
 *
 * The grid chooses the family; this chooses how dark it is. Dragging across the
 * middle swaps which of the pair's two palettes is selected, so the grid's
 * highlight follows the slider — one theme, described two ways.
 *
 * There is a real discontinuity between rungs 2 and 3 and the control does not
 * pretend otherwise: the step is marked on the track. See src/theme/continuum.ts
 * for why no readable palette lives in that gap.
 */
export function SchemeSlider() {
  const { t } = useTranslation();
  const { rung, setRung } = useTheme();

  // Unique per instance: the account menu and the design-system page can both
  // mount this, and a duplicate id would point every label at the first one.
  const inputId = useId();

  const last = CONTINUUM_LENGTH - 1;
  // Described to a screen reader as a position on a named scale, not as "3 of
  // 6": the number means nothing, and the two ends are what a reader is
  // actually choosing between.
  const valueText = rung === 0
    ? t('schemeDarkest')
    : rung === last
      ? t('schemeLightest')
      : `${rung + 1} / ${CONTINUUM_LENGTH}`;

  return (
    <div className="scheme-slider">
      <div className="scheme-slider__head">
        <label className="scheme-slider__label" htmlFor={inputId}>
          {t('schemeLabel')}
        </label>
        <output className="scheme-slider__value" htmlFor={inputId}>
          {valueText}
        </output>
      </div>

      <input
        id={inputId}
        type="range"
        className="scheme-slider__input"
        min={0}
        max={last}
        step={1}
        value={rung}
        aria-valuetext={valueText}
        onChange={(event) => setRung(Number(event.target.value))}
      />

      {/* The gap, drawn where it falls. `--gap-at` is the fraction of the track
          between the last dark rung and the first light one. */}
      <div
        className="scheme-slider__track-note"
        aria-hidden="true"
        style={{ '--gap-at': `${((CONTINUUM_STEPS - 0.5) / last) * 100}%` } as React.CSSProperties}
      />
    </div>
  );
}
