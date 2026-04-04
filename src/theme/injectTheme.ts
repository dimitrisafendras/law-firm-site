import { colors, fonts, glass, gradients, colorVarNames, fontVarNames, glassVarNames, gradientVarNames } from './tokens';

function mapVars(tokens: Record<string, string>, varNames: Record<string, string>): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(tokens)) {
    const varName = varNames[key];
    if (varName) lines.push(`  ${varName}: ${value};`);
  }
  return lines;
}

function buildVarBlock(
  colorTokens: Record<string, string>,
  fontTokens: Record<string, string>,
  glassTokens: Record<string, string>,
  gradientTokens: Record<string, string>,
): string {
  return [
    ...mapVars(colorTokens, colorVarNames),
    ...mapVars(fontTokens, fontVarNames),
    ...mapVars(glassTokens, glassVarNames),
    ...mapVars(gradientTokens, gradientVarNames),
  ].join('\n');
}

const lightVars = buildVarBlock(colors.light, fonts, glass.light, gradients.light);
const darkVars = buildVarBlock(colors.dark, fonts, glass.dark, gradients.dark);

function buildCSS(mode: 'system' | 'light' | 'dark'): string {
  if (mode === 'light') {
    return `:root {\n${lightVars}\n  color-scheme: light;\n}\n`;
  }
  if (mode === 'dark') {
    return `:root {\n${darkVars}\n  color-scheme: dark;\n}\n#social .button-icon {\n  filter: invert(1) brightness(2);\n}\n`;
  }
  // system (default)
  return `:root {\n${lightVars}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n${darkVars.replace(/^  /gm, '    ')}\n  }\n\n  #social .button-icon {\n    filter: invert(1) brightness(2);\n  }\n}\n`;
}

let styleEl: HTMLStyleElement | null = null;

export function injectTheme(): void {
  styleEl = document.createElement('style');
  styleEl.setAttribute('data-theme', 'generated');
  styleEl.textContent = buildCSS('system');
  document.head.prepend(styleEl);
}

export function setTheme(mode: 'system' | 'light' | 'dark'): void {
  if (!styleEl) {
    injectTheme();
  }
  styleEl!.textContent = buildCSS(mode);
}

export function getCurrentResolvedMode(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
