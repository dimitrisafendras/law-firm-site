import { colors, fonts, colorVarNames, fontVarNames } from './tokens';

function buildVarBlock(colorTokens: Record<string, string>, fontTokens: Record<string, string>): string {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(colorTokens)) {
    const varName = colorVarNames[key];
    if (varName) lines.push(`  ${varName}: ${value};`);
  }
  for (const [key, value] of Object.entries(fontTokens)) {
    const varName = fontVarNames[key];
    if (varName) lines.push(`  ${varName}: ${value};`);
  }
  return lines.join('\n');
}

export function injectTheme(): void {
  const lightVars = buildVarBlock(colors.light, fonts);
  const darkVars = buildVarBlock(colors.dark, fonts);

  const css = `:root {\n${lightVars}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n${darkVars.replace(/^  /gm, '    ')}\n  }\n\n  #social .button-icon {\n    filter: invert(1) brightness(2);\n  }\n}\n`;

  const style = document.createElement('style');
  style.setAttribute('data-theme', 'generated');
  style.textContent = css;
  document.head.prepend(style);
}
