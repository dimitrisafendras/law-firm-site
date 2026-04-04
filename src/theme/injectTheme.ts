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

const darkVars = buildVarBlock(colors.dark, fonts, glass.dark, gradients.dark);

let styleEl: HTMLStyleElement | null = null;

export function injectTheme(): void {
  styleEl = document.createElement('style');
  styleEl.setAttribute('data-theme', 'generated');
  styleEl.textContent = `:root {\n${darkVars}\n  color-scheme: dark;\n}\n#social .button-icon {\n  filter: invert(1) brightness(2);\n}\n`;
  document.head.prepend(styleEl);
}

export function setTheme(): void {
  if (!styleEl) {
    injectTheme();
  }
}

export function getCurrentResolvedMode(): 'dark' {
  return 'dark';
}
