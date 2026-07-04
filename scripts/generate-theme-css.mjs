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
  colorVarNames,
  fontVarNames,
  glassVarNames,
  gradientVarNames,
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

function buildVarBlock(colorTokens, fontTokens, glassTokens, gradientTokens) {
  return [
    ...mapVars(colorTokens, colorVarNames),
    ...mapVars(fontTokens, fontVarNames),
    ...mapVars(glassTokens, glassVarNames),
    ...mapVars(gradientTokens, gradientVarNames),
  ].join('\n');
}

// The app renders dark-only (the theme toggle is a decorative no-op), so this
// reproduces exactly the single :root block the runtime injector emitted,
// including `color-scheme: dark` and the social-icon filter rule.
const darkVars = buildVarBlock(colors.dark, fonts, glass.dark, gradients.dark);

const css = `/* AUTO-GENERATED from src/theme/tokens.ts by scripts/generate-theme-css.mjs.
   Do not edit by hand — edit tokens.ts and run \`npm run generate:theme\`
   (runs automatically on predev / prebuild). */
:root {
${darkVars}
  color-scheme: dark;
}
#social .button-icon {
  filter: invert(1) brightness(2);
}
`;

writeFileSync(outPath, css);
console.log(`  ok    theme.generated.css  (${css.length} bytes)`);
