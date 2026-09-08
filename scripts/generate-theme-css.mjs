// Build-time theme CSS generator.
//
// Emits src/theme/theme.generated.css from the design tokens in
// src/theme/tokens.ts, so every CSS custom property has a value in a static,
// render-blocking stylesheet *before* any application JS runs. This replaces
// the former runtime <style> injection (src/theme/injectTheme.ts), which left
// the :root vars undefined until React booted (a FOUC risk).
//
// tokens.ts is imported directly: it is fully erasable TypeScript, so Node's
// native type stripping loads it without a separate transpile step.
//
// Wired as the `predev` / `prebuild` npm hooks; run manually with
//   npm run generate:theme
//
// The output is a build artifact (git-ignored). Do not edit it by hand — edit
// tokens.ts and regenerate.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  fonts,
  radii,
  spacing,
  elevations,
  elevationsLight,
  decor,
  brand,
  motion,
  transitions,
  typeScale,
  weights,
  layout,
  capsTracking,
  textEmphasis,
  materials,
  colorVarNames,
  fontVarNames,
  glassVarNames,
  gradientVarNames,
  radiusVarNames,
  spacingVarNames,
  elevationVarNames,
  weightVarNames,
  layoutVarNames,
  textEmphasisVarNames,
  decorVarNames,
  brandVarNames,
  materialVarNames,
} from '../src/theme/tokens.ts';
import { palettes, DEFAULT_PALETTE_ID } from '../src/theme/palettes.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'src', 'theme', 'theme.generated.css');

/** Map a token object to `  --var: value;` lines using the shared name map. */
function mapVars(tokens, varNames) {
  const lines = [];
  for (const [key, value] of Object.entries(tokens)) {
    const varName = varNames[key];
    if (varName) lines.push(`  ${varName}: ${value};`);
  }
  return lines;
}

/**
 * The type scale is emitted per step as a size/weight/line-height/tracking
 * quartet, so a stylesheet takes a whole specimen rather than picking a size
 * and inventing the rest.
 */
function typeVars() {
  const lines = [];
  for (const [name, step] of Object.entries(typeScale)) {
    const k = name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    lines.push(`  --type-${k}-size: ${step.size};`);
    lines.push(`  --type-${k}-weight: ${step.weight};`);
    lines.push(`  --type-${k}-leading: ${step.lineHeight};`);
    lines.push(`  --type-${k}-tracking: ${step.tracking};`);
  }
  return lines;
}

/**
 * Everything that does NOT change with the palette: type, space, shape, motion.
 * Emitted once into bare `:root`, so switching palettes rewrites 45 custom
 * properties rather than 144.
 */
function buildInvariantBlock() {
  return [
    ...mapVars(fonts, fontVarNames),
    ...mapVars(radii, radiusVarNames),
    ...mapVars(spacing, spacingVarNames),
    ...mapVars(weights, weightVarNames),
    ...mapVars(layout, layoutVarNames),
    ...mapVars(textEmphasis, textEmphasisVarNames),
    // The two material variants. `clear` is thinner glass for bright, busy
    // grounds; src/styles/liquid-glass.css used to hardcode both its numbers.
    ...Object.entries(materials).flatMap(([variant, props]) =>
      mapVars(props, materialVarNames[variant] ?? {}),
    ),
    `  --type-caps-tracking-tight: ${capsTracking.tight};`,
    `  --type-caps-tracking-wide: ${capsTracking.wide};`,
    `  --motion-enter-travel: ${motion.enter.travel};`,
    `  --motion-enter-range: ${motion.enter.range};`,
    // 24 declarations across the component stylesheets read this as
    // `var(--transition, 0.3s)`. It was exported from tokens.ts but never
    // emitted, so every one of them was silently running on the literal
    // fallback and editing the token changed nothing.
    `  --transition: ${transitions.default};`,
    ...mapVars(decor, decorVarNames),
    ...mapVars(brand, brandVarNames),
    ...typeVars(),
  ].join('\n');
}

/**
 * Everything that DOES change: the colours, the glass material, the two
 * decorative gradients, and the elevation set — a shadow tuned to separate a
 * card from a near-black canvas reads as soot over a near-white one, so the
 * scheme picks which of the two sets it gets.
 */
function buildPaletteBlock(palette) {
  return [
    ...mapVars(palette.colors, colorVarNames),
    ...mapVars(palette.glass, glassVarNames),
    ...mapVars(palette.gradients, gradientVarNames),
    ...mapVars(palette.scheme === 'light' ? elevationsLight : elevations, elevationVarNames),
    `  color-scheme: ${palette.scheme};`,
  ].join('\n');
}

const defaultPalette = palettes.find((p) => p.id === DEFAULT_PALETTE_ID);
if (!defaultPalette) {
  throw new Error(`DEFAULT_PALETTE_ID "${DEFAULT_PALETTE_ID}" is not in the palette registry`);
}

// The default palette lands in bare `:root` as well as under its own attribute
// selector, so a document that has never been themed — a prerendered page
// before the inline theme script runs, or a viewer with JS off — still gets a
// complete set of custom properties rather than a naked page.
const paletteBlocks = palettes
  .map((palette) => `:root[data-theme='${palette.id}'] {\n${buildPaletteBlock(palette)}\n}`)
  .join('\n');

/*
 * One rule that depends on the SCHEME rather than on any one palette's colours,
 * so it is generated from the registry: add a light palette and it follows
 * automatically.
 *
 * The social icons are flat black SVGs, inverted to read on a dark ground. On a
 * light palette that inversion turns them white on white.
 *
 * The wordmark used to need a second rule here — an `invert() hue-rotate()`
 * that guessed its way to something legible on a light ground, because it was
 * an <img> whose fills CSS could not reach. VkmLogo inlines the artwork now and
 * paints it from `--brand-mark-ink` and `--brand-mark-accent`, which every
 * palette defines, so there is nothing left to filter.
 */
const lightPalettes = palettes.filter((p) => p.scheme === 'light');
const lightSelector = (suffix) =>
  lightPalettes.map((p) => `:root[data-theme='${p.id}'] ${suffix}`).join(',\n');

const schemeRules = [
  '#social .button-icon {',
  '  filter: invert(1) brightness(2);',
  '}',
  `${lightSelector('#social .button-icon')} {\n  filter: none;\n}`,
].join('\n');

const css = `/* AUTO-GENERATED from src/theme/tokens.ts + src/theme/palettes.ts by
   scripts/generate-theme-css.mjs. Do not edit by hand — edit the tokens and run
   \`npm run generate:theme\` (runs automatically on predev / prebuild).

   ${palettes.length} palettes; "${defaultPalette.id}" is the default and is emitted into bare
   :root as well as its own block. ThemeProvider (src/lib/theme.tsx) sets
   <html data-theme="..."> to pick one. */
:root {
${buildInvariantBlock()}
${buildPaletteBlock(defaultPalette)}
}
${paletteBlocks}
${schemeRules}
`;

writeFileSync(outPath, css);
console.log(`  ok    theme.generated.css  (${css.length} bytes, ${palettes.length} palettes)`);
