/**
 * Custom auto-hiding overlay scrollbar for the root scroller.
 *
 * The native scrollbar is fully removed in index.css (`scrollbar-width: none`),
 * so no gutter is reserved. This renders a fixed, draggable thumb
 * (.scrollbar-thumb) that fades in while scrolling and fades out after a short
 * idle. Wheel/keyboard/touch scrolling are untouched — this is purely the
 * visual indicator plus optional thumb dragging.
 */
const MIN_THUMB = 40;
const EDGE = 4; // px breathing room above/below the track

export function initAutoHideScrollbar(idleMs = 1200) {
  const root = document.documentElement;

  const thumb = document.createElement('div');
  thumb.className = 'scrollbar-thumb';
  thumb.setAttribute('aria-hidden', 'true');
  document.body.appendChild(thumb);

  let hideTimer: number | undefined;
  let dragging = false;
  let dragStartY = 0;
  let dragStartScroll = 0;

  const metrics = () => {
    const scrollHeight = root.scrollHeight;
    const viewport = window.innerHeight;
    const trackHeight = viewport - EDGE * 2;
    const thumbHeight = Math.max(MIN_THUMB, (viewport / scrollHeight) * trackHeight);
    return { scrollHeight, viewport, trackHeight, thumbHeight };
  };

  const update = () => {
    const { scrollHeight, viewport, trackHeight, thumbHeight } = metrics();
    if (scrollHeight <= viewport + 1) {
      thumb.style.display = 'none';
      return;
    }
    thumb.style.display = '';
    const progress = root.scrollTop / (scrollHeight - viewport);
    const top = EDGE + progress * (trackHeight - thumbHeight);
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translateY(${top}px)`;
  };

  const show = () => {
    thumb.classList.add('scrollbar-thumb--visible');
    window.clearTimeout(hideTimer);
    if (!dragging) {
      hideTimer = window.setTimeout(
        () => thumb.classList.remove('scrollbar-thumb--visible'),
        idleMs,
      );
    }
  };

  window.addEventListener('scroll', () => { update(); show(); }, { passive: true });
  window.addEventListener('resize', update);

  thumb.addEventListener('pointerdown', (event) => {
    dragging = true;
    dragStartY = event.clientY;
    dragStartScroll = root.scrollTop;
    thumb.classList.add('scrollbar-thumb--dragging');
    thumb.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  thumb.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const { scrollHeight, viewport, trackHeight, thumbHeight } = metrics();
    const scrollable = scrollHeight - viewport;
    const draggable = trackHeight - thumbHeight;
    if (draggable <= 0) return;
    root.scrollTop = dragStartScroll + ((event.clientY - dragStartY) / draggable) * scrollable;
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    thumb.classList.remove('scrollbar-thumb--dragging');
    show();
  };
  thumb.addEventListener('pointerup', endDrag);
  thumb.addEventListener('pointercancel', endDrag);

  update();
}
