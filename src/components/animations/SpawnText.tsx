import { Fragment } from 'react';
import type { CSSProperties } from 'react';
import './SpawnText.css';

export type SpawnMode = 'char' | 'word';

interface SpawnTextProps {
  /** The already-translated string. Callers pass t('...') — never literal copy. */
  text: string;
  /** Split granularity. `char` for display type, `word` for body copy. */
  mode?: SpawnMode;
  /**
   * Blend each unit's colour along the accent ramp so a split line still reads
   * as one continuous gradient (per-unit `background-clip: text` cannot).
   */
  gradient?: boolean;
  className?: string;
}

interface SpawnUnit {
  value: string;
  /** null for whitespace — gaps are never animated and never take a stagger slot. */
  index: number | null;
}

const WHITESPACE = /^\s+$/;

function splitUnits(text: string, mode: SpawnMode): SpawnUnit[] {
  const raw = mode === 'char' ? Array.from(text) : text.split(/(\s+)/);
  const units: SpawnUnit[] = [];
  let index = 0;

  for (const value of raw) {
    if (value === '') continue;
    if (WHITESPACE.test(value)) {
      // Normalise runs of whitespace (incl. newlines in translation strings)
      // to a single space so `white-space: pre` cannot introduce a line break.
      units.push({ value: ' ', index: null });
      continue;
    }
    units.push({ value, index: index++ });
  }

  return units;
}

/**
 * Splits a string into individually animatable units that "spawn" into place.
 *
 * Timing is driven entirely by CSS custom properties so callers can sequence it:
 *   --spawn-delay     when this element's first unit starts
 *   --spawn-stagger   interval between units
 *   --spawn-duration  per-unit duration
 *
 * The rendered spans are decorative — mark the owning element with an
 * `aria-label` and hide the spans from assistive tech.
 */
export function SpawnText({ text, mode = 'char', gradient = false, className = '' }: SpawnTextProps) {
  const units = splitUnits(text, mode);
  const animatedCount = units.reduce((total, unit) => (unit.index === null ? total : total + 1), 0);
  // Guard against divide-by-zero on single-unit strings.
  const lastIndex = Math.max(animatedCount - 1, 1);

  const rootClass = [
    'spawn-text',
    `spawn-text--${mode}`,
    gradient ? 'spawn-text--gradient' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    // Keying on the text remounts (and so replays) the reveal when the
    // active language changes.
    <span key={text} className={rootClass}>
      {units.map((unit, i) => {
        if (unit.index === null) {
          // A bare text node, deliberately NOT a styled span. A space wrapped in
          // an element with `white-space: pre` cannot collapse at a line break,
          // which indents every wrapped line by one space width and breaks the
          // left alignment of multi-line copy.
          return <Fragment key={i}>{unit.value}</Fragment>;
        }

        const style = { '--spawn-index': unit.index } as Record<string, string | number>;
        if (gradient) {
          // 1 at both ends, 0 in the middle — mirrors the original
          // accent → accent-container → accent ramp of the title gradient.
          style['--spawn-t'] = Math.abs(1 - (2 * unit.index) / lastIndex).toFixed(3);
        }

        return (
          <span key={i} className="spawn-text__unit" style={style as CSSProperties}>
            {unit.value}
          </span>
        );
      })}
    </span>
  );
}
