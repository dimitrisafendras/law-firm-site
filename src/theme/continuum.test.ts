import { describe, expect, it } from 'vitest';
import {
  CONTINUUM_LENGTH,
  CONTINUUM_STEPS,
  contrastRatio,
  continuumFor,
  continuumStop,
  relativeLuminance,
  rungAddress,
} from './continuum';
import { palettePairs } from './palettes';

/**
 * The ladder's guarantee, enforced rather than asserted in prose.
 *
 * An intermediate palette is generated, so nobody looks at it before it ships
 * the way they would a hand-picked one. These are the checks that stand in for
 * that look — and they are the reason the strides in continuum.ts are the
 * values they are: widen one and this file says so.
 *
 * The grounds are the three that actually carry text. CLAUDE.md is emphatic
 * that `--bg` is the kindest of them and that almost nothing important sits on
 * it, so checking against `--bg` alone would pass a palette that fails on the
 * hero. A `.glass` card lit by the page ramp's blooms is a fourth ground that
 * cannot be computed from tokens at all; `npm run audit:contrast` is what
 * covers that one, over real pixels.
 */
const groundsOf = (p: { colors: { background: string; surface: string; heroDeep: string } }) => [
  ['bg', p.colors.background] as const,
  ['surface', p.colors.surface] as const,
  ['hero-deep', p.colors.heroDeep] as const,
];

describe('the light-to-dark continuum', () => {
  it('gives every family a full ladder', () => {
    for (const pair of palettePairs) {
      expect(continuumFor(pair.light)).toHaveLength(CONTINUUM_LENGTH);
      // Either member describes the same ladder — the slider must not depend on
      // which end the reader happened to pick from the grid.
      expect(continuumFor(pair.dark).map((p) => p.colors.background)).toEqual(
        continuumFor(pair.light).map((p) => p.colors.background),
      );
    }
  });

  it('leaves the shipped palettes untouched at both ends', () => {
    for (const pair of palettePairs) {
      const ladder = continuumFor(pair.light);
      // Identity, not deep equality: step 0 must be the very same object, so a
      // reader who never moves the slider renders exactly what shipped.
      expect(ladder[0]).toBe(pair.dark);
      expect(ladder[CONTINUUM_LENGTH - 1]).toBe(pair.light);
      expect(continuumStop(pair.light, 0)).toBe(pair.light);
    }
  });

  it('holds 4.5:1 for body text and brand text on every rung', () => {
    const failures: string[] = [];

    for (const pair of palettePairs) {
      continuumFor(pair.light).forEach((rung, index) => {
        for (const [name, ground] of groundsOf(rung)) {
          for (const [label, fg] of [
            ['text', rung.colors.text],
            ['accent-text', rung.colors.accentText],
          ] as const) {
            const ratio = contrastRatio(fg, ground);
            if (ratio < 4.5) {
              failures.push(
                `${pair.family} rung ${index}: ${label} on ${name} is ${ratio.toFixed(2)}:1`,
              );
            }
          }
        }
      });
    }

    expect(failures).toEqual([]);
  });

  it('actually darkens, monotonically, with no rung indistinguishable from its neighbour', () => {
    for (const pair of palettePairs) {
      const ladder = continuumFor(pair.light);
      const luminance = ladder.map((p) => relativeLuminance(p.colors.background));

      for (let i = 1; i < luminance.length; i++) {
        // Strictly increasing: index 0 is the darkest rung.
        expect(
          luminance[i],
          `${pair.family} rung ${i} is not lighter than rung ${i - 1}`,
        ).toBeGreaterThan(luminance[i - 1]);
      }

      // A step the eye cannot see is a step that should not be on the slider.
      // The gap in the middle is exempt: it is the one the measurements in
      // continuum.ts say cannot be filled.
      for (let i = 1; i < luminance.length; i++) {
        if (i === CONTINUUM_STEPS) continue;
        const ratio = (luminance[i] + 0.05) / (luminance[i - 1] + 0.05);
        expect(
          ratio,
          `${pair.family} rungs ${i - 1}->${i} differ by only ${ratio.toFixed(3)}x`,
        ).toBeGreaterThan(1.08);
      }
    }
  });

  it('keeps the brand colour unshaded at the shipped ends', () => {
    for (const pair of palettePairs) {
      const ladder = continuumFor(pair.light);
      expect(ladder[0].colors.accentText).toBe(pair.dark.colors.accentText);
      expect(ladder[CONTINUUM_LENGTH - 1].colors.accentText).toBe(pair.light.colors.accentText);
    }
  });

  it('addresses rungs outward from each shipped end', () => {
    // Both ends of the ladder are a SHIPPED palette, which is step 0 — the one
    // the generator emits no extra block for. Getting this backwards renders
    // the innermost rung when the reader asked for the palette they picked,
    // which is exactly what shipped to the browser before this assertion
    // existed: rung 5 painted a mid grey-brown instead of Papyrus.
    expect(rungAddress(0)).toEqual({ id: 'dark', step: 0 });
    expect(rungAddress(CONTINUUM_LENGTH - 1)).toEqual({ id: 'light', step: 0 });

    // ... and the innermost pair, on either side of the gap, is the far step.
    expect(rungAddress(CONTINUUM_STEPS - 1)).toEqual({ id: 'dark', step: CONTINUUM_STEPS - 1 });
    expect(rungAddress(CONTINUUM_STEPS)).toEqual({ id: 'light', step: CONTINUUM_STEPS - 1 });

    // Out of range is clamped, not thrown: the index arrives from localStorage.
    expect(rungAddress(-5)).toEqual(rungAddress(0));
    expect(rungAddress(999)).toEqual(rungAddress(CONTINUUM_LENGTH - 1));
  });

  /*
   * The one that matters, and the one whose absence let the inversion through.
   *
   * The three assertions above describe what `rungAddress` should return, which
   * is only ever as right as whoever wrote them. This instead closes the loop:
   * what the address RESOLVES to must be the very palette `continuumFor` puts
   * at that index. Nothing here restates the mapping, so nothing here can agree
   * with a wrong one.
   */
  it('addresses the same palette the ladder holds at that index', () => {
    for (const pair of palettePairs) {
      const ladder = continuumFor(pair.light);

      for (let index = 0; index < CONTINUUM_LENGTH; index++) {
        const { id, step } = rungAddress(index);
        const resolved = continuumStop(id === 'light' ? pair.light : pair.dark, step);

        expect(
          resolved.colors.background,
          `${pair.family} rung ${index} addresses ${id} step ${step}`,
        ).toBe(ladder[index].colors.background);
        expect(resolved.colors.text).toBe(ladder[index].colors.text);
        expect(resolved.colors.accentText).toBe(ladder[index].colors.accentText);
      }
    }
  });

  /*
   * The inline script in index.html cannot import any of this, so it carries a
   * one-line copy of the step arithmetic. A copy that drifts would be stamped
   * before the first paint and then corrected by the provider a moment later —
   * a flash of the wrong palette on every load, and nothing failing anywhere.
   */
  it('matches the copy of the step arithmetic in the inline script', () => {
    const inlineStep = (rung: number) => (rung < 3 ? rung : 5 - rung);

    expect(CONTINUUM_STEPS).toBe(3);
    expect(CONTINUUM_LENGTH).toBe(6);
    for (let rung = 0; rung < CONTINUUM_LENGTH; rung++) {
      expect(inlineStep(rung), `inline script disagrees at rung ${rung}`).toBe(
        rungAddress(rung).step,
      );
    }
  });
});
