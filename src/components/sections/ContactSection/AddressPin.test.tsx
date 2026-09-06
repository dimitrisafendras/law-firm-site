import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderWithProviders, screen } from '@/test/utils';
import { AddressPin } from './AddressPin';
import en from '@/i18n/locales/en';

/**
 * The pin, as a control.
 *
 * The interesting half of this component is the half a browser will not let you
 * exercise by hand: `navigator.clipboard` is missing outside a secure context
 * and `writeText` rejects on an unfocused document, and both of those have to
 * end somewhere other than a silent no-op. So the API is stubbed here and the
 * three outcomes — wrote, rejected, absent — are each driven to their end state.
 *
 * The live region gets its own assertion because the bug it guards against is
 * invisible in a snapshot: a region React re-creates on every change is handed
 * to assistive tech as a new region, and a new region announces nothing. What
 * proves it is that the *same node* is in the document before and after.
 */

const ADDRESS = en.contactAddress;

/**
 * Replace the Clipboard API.
 *
 * Call this AFTER render, never before: renderWithProviders calls
 * userEvent.setup(), which installs a working fake clipboard of its own and
 * would otherwise overwrite this one — the symptom is a test that reports a
 * successful copy it never asked for.
 */
function stubClipboard(impl: ((text: string) => Promise<void>) | null) {
  const writeText = impl ? vi.fn(impl) : undefined;
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: writeText ? { writeText } : undefined,
  });
  return writeText;
}

describe('AddressPin', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    Reflect.deleteProperty(navigator, 'clipboard');
  });

  /** userEvent drives its own clock, so clicks go through fireEvent here. */
  function clickPin() {
    const button = screen.getByRole('button');
    act(() => {
      button.click();
    });
    // Flush the awaited clipboard promise inside act, so the state it sets is
    // committed before the assertions run.
    return act(async () => {});
  }

  it('names itself with what it copies, so "Copy address" says which', () => {
    renderWithProviders(<AddressPin />);
    stubClipboard(async () => {});

    const button = screen.getByRole('button');
    expect(button).toHaveAccessibleName(expect.stringContaining(en.contactPinCopy));
    expect(button).toHaveAccessibleName(expect.stringContaining(ADDRESS));
  });

  it('writes the address, confirms it, announces it, and reverts', async () => {
    renderWithProviders(<AddressPin />);
    const writeText = stubClipboard(async () => {});

    const live = document.querySelector('[aria-live="polite"]');
    expect(live).not.toBeNull();
    expect(live).toHaveTextContent('');

    await clickPin();

    expect(writeText).toHaveBeenCalledWith(ADDRESS);
    expect(screen.getByText(en.contactPinCopied)).toBeInTheDocument();

    // Same node, changed contents — the whole point of the live region.
    expect(document.querySelector('[aria-live="polite"]')).toBe(live);
    expect(live).toHaveTextContent(en.contactPinCopiedAnnounce);

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByText(en.contactPinCopy)).toBeInTheDocument();
    expect(live).toHaveTextContent('');
  });

  it('says so and shows the address when the write is rejected', async () => {
    renderWithProviders(<AddressPin />);
    stubClipboard(async () => {
      throw new DOMException('Document is not focused.', 'NotAllowedError');
    });

    await clickPin();

    expect(screen.getByText(en.contactPinFailed)).toBeInTheDocument();
    // The fallback: the address as selectable text, not only inside the button.
    expect(document.querySelector('.contact-section__pin-fallback')).toHaveTextContent(ADDRESS);
    expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent(ADDRESS);
  });

  it('fails the same way when the Clipboard API is absent entirely', async () => {
    renderWithProviders(<AddressPin />);
    stubClipboard(null);

    await clickPin();

    expect(screen.getByText(en.contactPinFailed)).toBeInTheDocument();
    expect(document.querySelector('.contact-section__pin-fallback')).toHaveTextContent(ADDRESS);
  });
});
