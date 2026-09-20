import { useCallback, useMemo, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { FONT_AUTO, fonts } from '@/theme';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/lib/theme';
// Shared radiogroup-row shape with ModeOptions/StatueOptions — `.look-options`
// is deliberately generic (see the note at the top of LookPicker.css) rather
// than named after either control, which is what lets a third one reuse it.
import '@/components/LookPicker/LookPicker.css';
import './ThemePicker.css';

/**
 * The reader's typeface, as a radiogroup: "Follow the look" first, then the
 * three explicit choices in registry order, each row set in its own face so
 * picking one is a preview rather than a guess.
 *
 * ── Why this has no trigger of its own ───────────────────────────────────────
 * The header is the site's widest fixed-width row and the only one that
 * cannot reflow — adding the look and statue triggers already pushed its
 * mobile breakpoint from 1024px to 1120px (see the comment on that breakpoint
 * in Navbar.css/Navbar.tsx). A fourth trigger was the obvious shape and the
 * wrong one; a typeface choice is a small enough decision to live inside the
 * palette control instead, the way `SchemeSlider` already does. `ThemePicker`
 * mounts this directly after `SchemeSlider` in its popover, so the whole
 * "Theme" surface — palette, light/dark rung, typeface — is one panel;
 * `AuthNavControl`'s embedded copy and the design-system page follow suit.
 *
 * Modelled on `StatueOptions`: a roving-tabindex radiogroup with an `auto`
 * sentinel ahead of the registry, because a font pin applies the instant a
 * row is chosen.
 */
export function FontPicker() {
  const { t } = useTranslation();
  const { font: active, fontOptions: options, mode, setFont } = useTheme();

  const groupRef = useRef<HTMLDivElement>(null);
  // 'auto' plus the registry entries, in the order the rows render. Memoized
  // for the same reason StatueOptions memoizes its list: a stable identity
  // keeps the keydown handler below from going stale every render.
  const ids = useMemo<readonly string[]>(() => [FONT_AUTO, ...options.map((f) => f.id)], [options]);

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
      // Same guard as ModeOptions/StatueOptions: keep the arrow from also
      // reaching a menu that hosts this group and from scrolling the page.
      event.stopPropagation();
      setFont(ids[next]);
      const rows = groupRef.current?.querySelectorAll<HTMLButtonElement>('.look-options__row');
      rows?.[next]?.focus();
    },
    [active, ids, setFont],
  );

  // The "Aa" sample is set in the face the row actually represents, so the
  // control previews rather than just names its choices. `auto`'s sample
  // follows the active LOOK, the one live thing it stands for — Jura in
  // digital, EB Garamond in classic — exactly what picking it will render.
  const sampleFamily = (id: string): string => {
    if (id === FONT_AUTO) return mode === 'classic' ? fonts.serif : fonts.sans;
    return options.find((f) => f.id === id)?.fonts.sans ?? fonts.sans;
  };

  return (
    <div
      ref={groupRef}
      className="look-options"
      role="radiogroup"
      aria-label={t('fontPickerLegend')}
      onKeyDown={onKeyDown}
    >
      {ids.map((id, index) => {
        const selected = id === active;
        const isAuto = id === FONT_AUTO;
        const option = isAuto ? null : options.find((f) => f.id === id) ?? null;
        const label = isAuto ? t('fontAuto') : t(option!.labelKey);
        const hintKey = isAuto ? 'fontAutoHint' : option!.hintKey;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            className={`look-options__row ${selected ? 'is-selected' : ''}`.trim()}
            onClick={() => setFont(id)}
          >
            <span
              className="font-options__sample"
              aria-hidden="true"
              style={{ fontFamily: sampleFamily(ids[index]) }}
            >
              Aa
            </span>
            <span className="look-options__body">
              <span className="look-options__label">{label}</span>
              <span className="look-options__hint">{t(hintKey)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
