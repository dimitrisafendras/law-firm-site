import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/lib/theme';
import { PaletteSwatches } from './PaletteSwatches';
import './ThemePicker.css';

/**
 * Standalone palette control: a swatch-shaped button that opens the grid.
 *
 * This is the form the header uses for signed-out visitors, who have no avatar
 * menu to hang the control inside. Signed-in visitors get the same
 * `PaletteSwatches` grid embedded directly in that menu instead — one control,
 * two housings, rather than two implementations that can drift apart.
 *
 * The dismissal behaviour deliberately mirrors AuthNavControl's: pointerdown
 * outside closes, Escape closes and returns focus to the trigger.
 */
export function ThemePicker() {
  const { t } = useTranslation();
  const { palette } = useTheme();

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
    <div className="theme-picker" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="theme-picker__trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${t('themePickerOpen')}: ${palette.label}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className="theme-picker__chip"
          aria-hidden="true"
          style={
            {
              '--swatch-ground': palette.colors.background,
              '--swatch-accent': palette.colors.accent,
              '--swatch-secondary': palette.colors.secondary,
            } as React.CSSProperties
          }
        />
      </button>

      {open && (
        <div className="theme-picker__panel glass">
          <PaletteSwatches />
        </div>
      )}
    </div>
  );
}
