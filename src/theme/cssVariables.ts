/**
 * Auto-derived CSS variable references from the token → var-name mapping.
 * Use these in inline styles: style={{ color: cssVar.accent }}
 */
import { colorVarNames, fontVarNames, glassVarNames } from './tokens';

function toVarRefs<T extends Record<string, string>>(map: T): { [K in keyof T]: string } {
  const out = {} as Record<string, string>;
  for (const [key, varName] of Object.entries(map)) {
    out[key] = `var(${varName})`;
  }
  return out as { [K in keyof T]: string };
}

export const cssVar = {
  ...toVarRefs(colorVarNames),
  ...toVarRefs(fontVarNames),
  ...toVarRefs(glassVarNames),
} as const;
