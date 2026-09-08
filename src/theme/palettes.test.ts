import { describe, expect, it } from 'vitest';
import { palettes, palettePairs, paletteRadioOrder, paletteById, isPaletteId, DEFAULT_PALETTE_ID } from './palettes';
import { colorVarNames, glassVarNames, gradientVarNames } from './tokens';

/**
 * The registry's invariants.
 *
 * `palettes.ts` already throws on load if the pairing is broken, so importing
 * this file at all proves most of it. These spell the rules out anyway: a
 * thrown module-load error names one violation and stops, where a failing test
 * names the rule, and the pairing is the thing a future palette is most likely
 * to break — it is easy to add a seed to one column and forget the other.
 */
describe('palettes', () => {
  it('ships nine schemes, each as a light and a dark', () => {
    expect(palettes).toHaveLength(18);
    expect(palettes.filter((p) => p.scheme === 'light')).toHaveLength(9);
    expect(palettes.filter((p) => p.scheme === 'dark')).toHaveLength(9);
  });

  it('pairs every palette with exactly one opposite-scheme twin', () => {
    for (const palette of palettes) {
      const twin = palettes.find((p) => p.id === palette.pair);
      expect(twin, `${palette.id} pairs with unknown "${palette.pair}"`).toBeDefined();
      expect(twin!.pair, `${palette.id} <-> ${twin!.id} is not symmetric`).toBe(palette.id);
      expect(twin!.scheme, `${palette.id} and ${twin!.id} are both ${palette.scheme}`).not.toBe(
        palette.scheme,
      );
    }
  });

  it('exposes nine pairs, each a light and a dark of one family', () => {
    expect(palettePairs).toHaveLength(9);
    for (const pair of palettePairs) {
      expect(pair.light.scheme).toBe('light');
      expect(pair.dark.scheme).toBe('dark');
      expect(pair.light.pair).toBe(pair.dark.id);
      expect(pair.light.family).toBe(pair.family);
      expect(pair.dark.family).toBe(pair.family);
    }
    expect(new Set(palettePairs.map((p) => p.family)).size).toBe(9);
  });

  it('orders the radios the way the picker reads: light then dark, row by row', () => {
    // The arrow-key maths depends on this exactly: ±1 flips a scheme between
    // light and dark, ±2 moves to the next scheme on the same side.
    expect(paletteRadioOrder).toHaveLength(18);
    paletteRadioOrder.forEach((palette, i) => {
      expect(palette.scheme).toBe(i % 2 === 0 ? 'light' : 'dark');
    });
    for (let i = 0; i < paletteRadioOrder.length; i += 2) {
      expect(paletteRadioOrder[i].pair).toBe(paletteRadioOrder[i + 1].id);
    }
    // Every palette appears exactly once.
    expect(new Set(paletteRadioOrder.map((p) => p.id)).size).toBe(palettes.length);
  });

  it('gives every palette a value for every token the generator emits', () => {
    // A palette missing a key would silently inherit whatever the previous
    // block set, which is the failure the seed/factory design exists to stop.
    for (const palette of palettes) {
      for (const key of Object.keys(colorVarNames)) {
        expect(palette.colors[key as keyof typeof palette.colors], `${palette.id}.colors.${key}`).toBeTruthy();
      }
      for (const key of Object.keys(glassVarNames)) {
        expect(palette.glass[key as keyof typeof palette.glass], `${palette.id}.glass.${key}`).toBeTruthy();
      }
      for (const key of Object.keys(gradientVarNames)) {
        expect(palette.gradients[key as keyof typeof palette.gradients], `${palette.id}.gradients.${key}`).toBeTruthy();
      }
    }
  });

  it('has unique ids and labels', () => {
    const ids = palettes.map((p) => p.id);
    const labels = palettes.map((p) => p.label);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it('resolves an unknown id to the default, not to the first entry', () => {
    // The registry is grouped light-then-dark, so palettes[0] is a light
    // palette while the default is dark. Falling back by index would hand a
    // first-time visitor the wrong scheme.
    expect(palettes[0].id).not.toBe(DEFAULT_PALETTE_ID);
    expect(paletteById('no-such-palette').id).toBe(DEFAULT_PALETTE_ID);
    expect(paletteById(null).id).toBe(DEFAULT_PALETTE_ID);
    expect(paletteById('lapis').id).toBe('lapis');
  });

  it('recognises exactly the registered ids', () => {
    expect(isPaletteId('obsidian')).toBe(true);
    expect(isPaletteId('umber')).toBe(true);
    expect(isPaletteId('chartreuse')).toBe(false);
    expect(isPaletteId(null)).toBe(false);
  });
});
