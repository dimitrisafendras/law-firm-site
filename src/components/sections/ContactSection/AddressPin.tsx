import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/i18n';

type CopyState = 'idle' | 'copied' | 'failed';

/** How long the confirmation stands before the control returns to rest. */
const COPIED_MS = 4000;
/** Longer for the failure, because that state carries the address to copy by hand. */
const FAILED_MS = 12000;

/**
 * The map's pin — and the section's one piece of interaction.
 *
 * It used to be a decorative `<g>` inside an `aria-hidden` SVG, which is the
 * right shape for a picture and the wrong shape for a control. A real
 * `<button>` is what earns a tab stop, a focus ring and an Enter key; an SVG
 * node with an `onClick` gets none of those for free, and a `<div role=button>`
 * would mean re-implementing all three by hand.
 *
 * So the marker is drawn as HTML, absolutely positioned over the SVG at the
 * exact point the SVG puts Athens (see ContactSection.css — the map's centre is
 * pinned to `--pin-y` by construction, at every viewport width).
 *
 * Clipboard writes fail for reasons that have nothing to do with this code:
 * `navigator.clipboard` simply does not exist outside a secure context, and
 * `writeText` rejects on a document that is not focused or whose permission was
 * refused. All three end in the same place here — the `failed` state, which
 * says so and prints the address underneath for the visitor to select and copy
 * by hand. There is no path through this component that assumes success.
 */
export function AddressPin() {
  const { t } = useTranslation();
  const address = t('contactAddress');

  const [state, setState] = useState<CopyState>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copy = useCallback(async () => {
    clearTimeout(timerRef.current);

    let ok = false;
    try {
      // The guard is not belt-and-braces: on `http://` and inside some
      // embedded webviews `navigator.clipboard` is undefined, so the call
      // itself is what throws, before any promise exists to reject.
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(address);
      ok = true;
    } catch {
      ok = false;
    }

    setState(ok ? 'copied' : 'failed');
    timerRef.current = setTimeout(() => setState('idle'), ok ? COPIED_MS : FAILED_MS);
  }, [address]);

  const actionLabel =
    state === 'copied' ? t('contactPinCopied')
    : state === 'failed' ? t('contactPinFailed')
    : t('contactPinCopy');

  return (
    <div className="contact-section__pin" data-state={state}>
      <button
        type="button"
        className="contact-section__pin-button"
        onClick={() => void copy()}
      >
        <span className="contact-section__pin-marker" aria-hidden="true">
          <span className="contact-section__pin-halo" />
          <span className="contact-section__pin-dot" />
        </span>
        <span className="contact-section__pin-chip">
          <span className="contact-section__pin-city">{t('contactPinLabel')}</span>
          <span className="contact-section__pin-action">{actionLabel}</span>
          {/*
            Part of the accessible name, not decoration. "Copy address" on its
            own does not say *which* address, and the chip has to stay small
            enough to sit on a map — so the answer is in the name rather than on
            the surface. The visible words stay a prefix of that name, so a
            voice-control user can still say what they see.
          */}
          <span className="contact-section__pin-sr">{address}</span>
        </span>
      </button>

      {/*
        The fallback. A confirmation that only ever says "that didn't work"
        leaves the visitor exactly where they started, so the failure state
        prints the address as selectable text directly under the pin.
      */}
      {state === 'failed' && (
        <p className="contact-section__pin-fallback">{address}</p>
      )}

      {/*
        The live region is this wrapper, and it is deliberately stable and
        unkeyed — the same trap the testimonial stage documents. A region that
        React destroys and rebuilds is handed to assistive tech as a brand-new
        region rather than a changed one, and a brand-new region announces
        nothing. So the element is always in the tree from first render and only
        its text content changes.

        `aria-atomic` because "Could not copy" without the address that follows
        it is not the message.
      */}
      <div className="contact-section__pin-live" aria-live="polite" aria-atomic="true">
        {state === 'copied' && t('contactPinCopiedAnnounce')}
        {state === 'failed' && t('contactPinFailedAnnounce', { address })}
      </div>
    </div>
  );
}
