# Law Firm Website — Project Instructions

## Tech Stack
- React 19 + TypeScript + Vite
- Vanilla CSS with CSS custom properties (no Tailwind, no CSS-in-JS)

## Theme Rules (CRITICAL)

**Never use hardcoded design values that exist in the theme.**

All design tokens are centralized in `src/theme/tokens.ts`. This is the single source of truth for:
- Colors (light & dark mode)
- Typography (font families, sizes, line heights, letter spacing)
- Spacing scale
- Border radii
- Breakpoints
- Layout constraints (max-width)
- Transitions

### How to use the theme

**In CSS files:** Always reference CSS custom properties (`var(--text)`, `var(--accent)`, etc.) — never raw hex/rgb values that are already defined in the theme.

**In TypeScript/TSX:** Import from `src/theme` when you need token values in JS:
```ts
import { colors, spacing, fonts } from '@/theme';
// or
import { cssVar } from '@/theme';
```

**When adding a new design value:**
1. First check if an appropriate token already exists in `src/theme/tokens.ts`
2. If not, add the new token to `tokens.ts` AND the corresponding CSS variable in `src/index.css`
3. Then reference the token — never inline the raw value

### What counts as a violation
- `color: #aa3bff` instead of `color: var(--accent)`
- `font-family: system-ui, ...` instead of `font-family: var(--sans)`
- `padding: 32px` when `spacing[7]` or the semantic intent already exists
- Any raw color, font, shadow, or border value that duplicates a theme token

### Exceptions
- One-off values that are truly unique to a single element and don't belong in the design system (e.g., a specific SVG transform) are acceptable as inline values.
- Browser defaults and resets (`margin: 0`, `box-sizing: border-box`) don't need tokens.
