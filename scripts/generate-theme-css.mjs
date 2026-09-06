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
  colors,
  fonts,
  glass,
  gradients,
  radii,
  spacing,
  elevations,
  elevationsMarble,
  decor,
  motion,
  typeScale,
  weights,
  layout,
  capsTracking,
  textEmphasis,
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
} from '../src/theme/tokens.ts';

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

function buildVarBlock(colorTokens, fontTokens, glassTokens, gradientTokens) {
  return [
    ...mapVars(colorTokens, colorVarNames),
    ...mapVars(fontTokens, fontVarNames),
    ...mapVars(glassTokens, glassVarNames),
    ...mapVars(gradientTokens, gradientVarNames),
    ...mapVars(radii, radiusVarNames),
    ...mapVars(spacing, spacingVarNames),
    ...mapVars(elevations, elevationVarNames),
    ...mapVars(weights, weightVarNames),
    ...mapVars(layout, layoutVarNames),
    ...mapVars(textEmphasis, textEmphasisVarNames),
    `  --type-caps-tracking-tight: ${capsTracking.tight};`,
    `  --type-caps-tracking-wide: ${capsTracking.wide};`,
    `  --motion-enter-travel: ${motion.enter.travel};`,
    `  --motion-enter-range: ${motion.enter.range};`,
    ...mapVars(decor, decorVarNames),
    ...typeVars(),
  ].join('\n');
}

// The app renders dark-only (the theme toggle is a decorative no-op), so this
// reproduces exactly the single :root block the runtime injector emitted,
// including `color-scheme: dark` and the social-icon filter rule.
const darkVars = buildVarBlock(colors.dark, fonts, glass.dark, gradients.dark);

/**
 * The marble block.
 *
 * `colors.light` has been fully specified in tokens.ts since the beginning and
 * has never been emitted, because the app renders dark-only. It is not a light
 * *theme* — the site has no theme switch and is not getting one. It is a
 * second *material*: an opaque pale surface that a section can stand on, the
 * way the statue stands on a pedestal.
 *
 * Scoping it to an attribute rather than a media query is the whole point. Two
 * materials coexist on one page, in one theme, and a section opts in.
 *
 * Glass inside marble takes the light glass values, and elevation takes the
 * marble set: the dark shadows are tuned for a near-black canvas and read as
 * grime on #F5F5F5.
 */
const marbleVars = [
  ...mapVars(colors.light, colorVarNames),
  ...mapVars(glass.light, glassVarNames),
  ...mapVars(gradients.light, gradientVarNames),
  ...mapVars(elevationsMarble, elevationVarNames),
].join('\n');

const css = `/* AUTO-GENERATED from src/theme/tokens.ts by scripts/generate-theme-css.mjs.
   Do not edit by hand — edit tokens.ts and run \`npm run generate:theme\`
   (runs automatically on predev / prebuild). */
:root {
${darkVars}
  color-scheme: dark;
}
[data-material='marble'] {
${marbleVars}
  color-scheme: light;
}
#social .button-icon {
  filter: invert(1) brightness(2);
}
`;

writeFileSync(outPath, css);
console.log(`  ok    theme.generated.css  (${css.length} bytes)`);
