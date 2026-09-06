import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/i18n';

type CopyState = 'idle' | 'copied' | 'failed';

/** How long the confirmation stands before the control returns to rest. */
const COPIED_MS = 3000;

interface CopyButtonProps {
  /** The literal text put on the clipboard — an address, an email, a number. */
  value: string;
  /**
   * What the value *is*, already translated ("Email", "Phone"). It is what the
   * button is called, because "Copy" on a row that already shows the address
   * names the action and not its object — and there are three of these controls
   * within a few centimetres of one another.
   */
  label: string;
}

/**
 * Copy-to-clipboard, for one value.
 *
 * The same job the map pin does, at the size of a row rather than a chip, so
 * the two share a shape but not an implementation: the pin is one control with
 * a marker, a label and a fallback that prints the address; this is an icon
 * beside text that is already on screen. There is nothing to fall back *to*
 * here — the value is right there to select by hand — so the failure state is
 * announced and shown on the control, and that is all it needs to do.
 *
 * The clipboard write can fail for reasons that have nothing to do with this
 * code: `navigator.clipboard` does not exist outside a secure context (so on
 * `http://` the property access is what fails, before there is a promise to
 * reject), and `writeText` rejects on an unfocused document or a refused
 * permission. All of them land in `failed`.
 */
export function CopyButton({ value, label }: CopyButtonProps) {
  const { t } = useTranslation();
  const [state, setState] = useState<CopyState>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copy = useCallback(async () => {
    clearTimeout(timerRef.current);

    let ok = false;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      ok = false;
    }

    setState(ok ? 'copied' : 'failed');
    timerRef.current = setTimeout(() => setState('idle'), COPIED_MS);
  }, [value]);

  return (
    <>
      <button
        type="button"
        className="contact-section__copy"
        data-state={state}
        onClick={() => void copy()}
        aria-label={t('contactCopyLabel', { label })}
      >
        {/*
          Two glyphs in one box, swapped by state rather than cross-faded: at
          16px a transition between a page outline and a tick is a smear. The
          icon is `aria-hidden` throughout — the button's name carries what it
          does and the live region below carries what happened, so a screen
          reader never has to interpret a shape.
        */}
        <svg
          className="contact-section__copy-icon"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          {state === 'copied' ? (
            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
          ) : (
            <>
              <rect x="5.5" y="5.5" width="8" height="8" rx="2" />
              <path d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H4a1.5 1.5 0 0 0-1.5 1.5V9a1.5 1.5 0 0 0 1.5 1.5h.5" />
            </>
          )}
        </svg>
      </button>

      {/*
        Stable and unkeyed, for the reason the pin's is: a live region React
        rebuilds is handed to assistive tech as a new region rather than a
        changed one, and a new region announces nothing.
      */}
      <span className="contact-section__pin-live" aria-live="polite" aria-atomic="true">
        {state === 'copied' && t('contactCopiedAnnounce', { label })}
        {state === 'failed' && t('contactCopyFailedAnnounce', { label })}
      </span>
    </>
  );
}
