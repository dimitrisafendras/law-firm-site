import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { watchSection } from './sectionSpy';

let fire: () => void = () => {};
beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: () => void) { fire = callback; }
    observe() {}
    disconnect() {}
  });
});

const section = (id: string, top: number) => {
  const element = document.createElement('section');
  if (id) element.id = id;
  element.getBoundingClientRect = () => ({ top, bottom: top + window.innerHeight } as DOMRect);
  return element;
};

afterEach(() => {
  window.history.replaceState(null, '', '/');
  vi.unstubAllGlobals();
});

it('names the section crossing the middle of the viewport without adding history', () => {
  const length = window.history.length;
  const hero = section('', -window.innerHeight);
  const team = section('team', 0);
  const stop = watchSection([hero, team]);
  fire();
  expect(window.location.hash).toBe('#team');

  hero.getBoundingClientRect = () => ({ top: 0, bottom: window.innerHeight } as DOMRect);
  team.getBoundingClientRect = () => ({ top: window.innerHeight, bottom: 2 * window.innerHeight } as DOMRect);
  fire();
  expect(window.location.hash).toBe('');
  expect(window.history.length).toBe(length);
  stop();
});
