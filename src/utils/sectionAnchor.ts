/**
 * Stamps the section you were reading onto the history entry you are leaving,
 * so the browser's Back button returns you to it.
 *
 * ─── Why this is needed ──────────────────────────────────────────────────────
 *
 * The home page is one document with five full-viewport sections in it, and the
 * detail pages are hash routes off the same document. Scrolling to the practice
 * grid and opening a card leaves the history stack looking like this:
 *
 *     [ '' ] → [ '#practice/corporate' ]
 *
 * The entry you came from records no section, because scrolling does not touch
 * the URL. Back therefore returns to the top of the home page — and it did so
 * even before `history.scrollRestoration` was set to `manual` in index.html,
 * whenever the restored offset was stale (the sections below the fold carry
 * `content-visibility: auto`, so their reserved height is not their real one
 * until they have been rendered).
 *
 * Rewriting that entry to name the section closes the gap:
 *
 *     [ '#practice' ] → [ '#practice/corporate' ]
 *
 * Now Back is an ordinary anchor navigation, and HomePage's existing align
 * effect — which already handles `content-visibility` settling with three
 * spaced re-aligns — puts you back where you were. Nothing new has to know how
 * to restore a scroll position; the URL says where you are, which it should
 * have done all along.
 *
 * ─── Why a delegated listener ────────────────────────────────────────────────
 *
 * The two cards that link out are plain `<a href="#practice/…">` and
 * `<a href="#partner/…">`, and they should stay plain: they are real links, they
 * middle-click and open in a new tab correctly, and they work with JS disabled.
 * Reading the anchor off the href at click time keeps that, and means a third
 * kind of detail page needs one entry in ANCHOR_FOR below rather than a change
 * to a component.
 */

/**
 * Which home-page section a detail route belongs to, keyed by the first segment
 * of its hash. The values are the same anchors the detail pages' own back links
 * use (`#practice`, `#team`) — those are the visible half of this contract.
 */
const ANCHOR_FOR: Record<string, string> = {
  practice: 'practice',
  partner: 'team',
};

/**
 * Hashes that mean "the home page". Stamping is only correct while one of these
 * is the current entry: navigating detail-to-detail must not rewrite the detail
 * entry you are standing on, or Back would skip it entirely.
 */
const HOME_HASHES = new Set(['', 'team', 'practice', 'testimonials', 'contact']);

/** `#practice/corporate` → `practice/corporate`, `#` → ``. */
function hashPath(hash: string): string {
  return hash.replace(/^#/, '').split(/[?&]/)[0];
}

export function initSectionAnchor() {
  document.addEventListener('click', (event) => {
    /*
     * Anything that is not a plain left click is the browser's business, not
     * ours: a modified click opens a new tab and never leaves this entry, and a
     * handler that has already called preventDefault owns the navigation.
     */
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
    if (!(link instanceof HTMLAnchorElement)) return;

    const anchor = ANCHOR_FOR[hashPath(link.hash).split('/')[0]];
    if (!anchor) return;

    const current = hashPath(window.location.hash);
    if (!HOME_HASHES.has(current)) return;
    if (current === anchor) return;

    /*
     * `replaceState` rather than assigning `location.hash`: assigning would
     * push an entry of its own, so Back would land on the section and a second
     * Back would be needed to leave the page. It also fires no `hashchange`,
     * which is what we want — App's route state must not re-render out from
     * under the click that is about to navigate.
     */
    window.history.replaceState(window.history.state, '', `#${anchor}`);
  });
}
