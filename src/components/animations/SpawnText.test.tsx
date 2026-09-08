import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SpawnText } from './SpawnText';

/**
 * These pin the `key={text}` on SpawnText's root span.
 *
 * That key looks redundant — it is the only element the component returns — but
 * it is load-bearing: React compares key as well as type at a given position,
 * so changing the text unmounts the old span and mounts a new one, and the
 * entrance animation plays again from the start. Without it React would reuse
 * the same DOM node, the CSS animation would not restart, and new copy would
 * simply appear.
 *
 * What actually changes the text: a language switch, and a content override
 * arriving from ContentProvider. NOT an admin typing — EditableSpawnText routes
 * anyone with edit mode unlocked to a plain EditableText instead, so an editing
 * admin never renders SpawnText at all. The replay is what the next visitor
 * (or the admin once they re-lock) sees.
 *
 * (SpawnText was the first suspect for a duplicate-key warning on the
 * design-system page. It was not the cause — a lone keyed root cannot collide
 * with a sibling — and it is deliberately left alone. These tests exist so a
 * future reader who has the same suspicion can see why the key stays.)
 */
describe('SpawnText', () => {
  const unitsOf = (container: HTMLElement) =>
    container.querySelectorAll('.spawn-text__unit');

  it('splits a string into one animatable unit per character', () => {
    const { container } = render(<SpawnText text="Hi there" />);

    // Seven letters; the space is a bare text node, not a unit.
    expect(unitsOf(container)).toHaveLength(7);
    expect(container.textContent).toBe('Hi there');
  });

  it('numbers units so CSS can stagger them, skipping whitespace', () => {
    const { container } = render(<SpawnText text="a b" />);
    const indices = [...unitsOf(container)].map((el) =>
      (el as HTMLElement).style.getPropertyValue('--spawn-index'),
    );

    expect(indices).toEqual(['0', '1']);
  });

  it('remounts the root when the text changes, so the reveal replays', () => {
    const { container, rerender } = render(<SpawnText text="Legal Counsel" />);
    const before = container.querySelector('.spawn-text');

    rerender(<SpawnText text="Νομικές Συμβουλές" />);
    const after = container.querySelector('.spawn-text');

    expect(after).not.toBe(before);
    expect(after?.textContent).toBe('Νομικές Συμβουλές');
  });

  it('keeps the same root when only a presentational prop changes', () => {
    const { container, rerender } = render(<SpawnText text="Legal Counsel" />);
    const before = container.querySelector('.spawn-text');

    rerender(<SpawnText text="Legal Counsel" className="extra" />);
    const after = container.querySelector('.spawn-text');

    expect(after).toBe(before);
    expect(after).toHaveClass('extra');
  });

  it('can hide the split from assistive technology', () => {
    render(
      <h2 aria-label="Our Expertise">
        <SpawnText text="Our Expertise" ariaHidden />
      </h2>,
    );

    // The heading keeps its real name rather than a spelled-out one.
    expect(screen.getByRole('heading', { name: 'Our Expertise' })).toBeInTheDocument();
  });
});
