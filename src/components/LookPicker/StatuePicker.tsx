import { useCallback, useEffect, useRef, useState } from 'react';
import { STATUE_AUTO } from '@/theme';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/lib/theme';
import { ScalesGlyph } from './glyphs';
import { StatueOptions } from './StatueOptions';
import './LookPicker.css';

/**
 * Standalone statue-pin control: a trigger with a fixed scales-of-justice
 * glyph, opening a popover with the pin choice.
 *
 * The signed-out housing for `StatueOptions` — mirrors `ThemePicker` exactly.
 * Signed-in visitors get the same radiogroup embedded in the account menu
 * instead.
 */
export function StatuePicker() {
  const { t } = useTranslation();
  const { statue, statues } = useTheme();
  const label = statue === STATUE_AUTO ? t('statueAuto') : t(statues.find((s) => s.id === statue)?.labelKey ?? 'statueAuto');

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  return (
    <div className="statue-picker" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="statue-picker__trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${t('statuePickerOpen')}: ${label}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="statue-picker__glyph" aria-hidden="true">
          <ScalesGlyph />
        </span>
      </button>

      {open && (
        <div className="statue-picker__panel glass">
          <StatueOptions />
        </div>
      )}
    </div>
  );
}
