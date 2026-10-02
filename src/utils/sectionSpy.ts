/**
 * Keeps the address bar naming the home-page section being read.
 *
 * The home page is five full-viewport sections, and scrolling between them
 * used to leave the URL wherever the last click had put it — `#team` while
 * reading the contact form, or nothing at all. Now the section that crosses the
 * middle of the viewport is the hash: `#team`, `#practice`, `#clients`,
 * `#contact`, and the bare address for the hero, which has no anchor of its
 * own because it is where the page starts.
 *
 * `replaceState`, never `location.hash`, for the reasons sectionAnchor.ts
 * gives: assigning would push a history entry per section scrolled past, and
 * it would fire `hashchange`, which App routes on. This also means the hash
 * stamped there on a click out to a detail page is normally already right.
 *
 * A reload still lands on the hero whatever the hash says — the inline script
 * in index.html drops a section hash on reload before the browser can scroll
 * to it — so naming the section here never changes what a reload shows.
 */
export function watchSection(sections: Element[]): () => void {
  let current = window.location.hash;

  const update = () => {
    const middle = window.innerHeight / 2;
    const reading = sections.find((section) => {
      const box = section.getBoundingClientRect();
      return box.top <= middle && box.bottom > middle;
    });
    // Between sections (the footer, say) the last one named stays named.
    if (!reading) return;
    const hash = reading.id ? `#${reading.id}` : '';
    if (hash === current) return;
    current = hash;
    const { pathname, search } = window.location;
    window.history.replaceState(window.history.state, '', `${pathname}${search}${hash}`);
  };

  /*
   * A zero-height band across the middle of the viewport: an observer only
   * fires when a section starts or stops crossing it, so this costs nothing
   * while the reader stays inside one section — no scroll listener, no
   * per-frame measuring.
   */
  const observer = new IntersectionObserver(update, { rootMargin: '-50% 0px -50% 0px' });
  for (const section of sections) observer.observe(section);
  return () => observer.disconnect();
}
