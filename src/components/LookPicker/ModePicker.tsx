import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/lib/theme';
import { ModeGlyph } from './glyphs';
import { ModeOptions } from './ModeOptions';
import './LookPicker.css';

/**
 * Standalone look control: a trigger showing the current look's glyph, opening
 * a popover with the two-way choice.
 *
 * The signed-out housing for `ModeOptions` — see `ThemePicker`, which this
 * mirrors exactly (same dismissal behaviour, same popover material). Signed-in
 * visitors get the same radiogroup embedded in the account menu instead.
 */
export function ModePicker() {
  const { t } = useTranslation();
  const { mode, modes } = useTheme();
  const current = modes.find((m) => m.id === mode) ?? modes[0];

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
    <div className="mode-picker" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="mode-picker__trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${t('modePickerOpen')}: ${t(current.labelKey)}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="mode-picker__glyph" aria-hidden="true">
          <ModeGlyph mode={mode} />
        </span>
      </button>

      {open && (
        <div className="mode-picker__panel glass">
          <ModeOptions />
        </div>
      )}
    </div>
  );
}
