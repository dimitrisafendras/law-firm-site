import { describe, it, expect } from 'vitest';
import en from './locales/en';
import el from './locales/el';

// Belt-and-braces alongside the compile-time `satisfies` constraint in el.ts:
// this catches drift at test time too, and pins that every value is a string.
describe('i18n locale parity', () => {
  it('el defines exactly the same keys as en', () => {
    const enKeys = Object.keys(en).sort();
    const elKeys = Object.keys(el).sort();
    expect(elKeys).toEqual(enKeys);
  });

  it('every el value is a non-empty string', () => {
    for (const [key, value] of Object.entries(el)) {
      expect(typeof value, `el.${key} should be a string`).toBe('string');
      expect((value as string).length, `el.${key} should be non-empty`).toBeGreaterThan(0);
    }
  });
});
