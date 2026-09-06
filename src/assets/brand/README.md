# VKM brand artwork

The originals as supplied. **These are the reference, not the build inputs** —
nothing imports them. The mark the site renders is `src/assets/VkmLogo.tsx`,
which traces the monogram's geometry but differs in two ways it has to:

- **The originals name no `font-family`.** Left as-is they render in whatever
  the browser defaults to, which is Times on most. The component names the
  site's display face explicitly.
- **The originals are built for white.** Navy `#002B49` letters with a white
  keyline read as an interlock on paper; on this site's `#0F1A2E` ground the
  navy measures about 1.3:1 and simply disappears. The component keeps the
  construction — two weights of blue, middle letter picked out, keyline holding
  the glyphs apart — with the navy lifted and the keyline inverted. Both the
  print values and the dark-ground values live in `brand` in `src/theme/tokens.ts`.

Keep these files so a light-background export (letterhead, an invoice, a press
kit) can be produced from the artwork as drawn rather than reverse-engineered
from the component.

`vkm-monogram-source.svg` is the current mark. `vkm-wordmark-source.svg` is the
earlier lockup with the LEGAL sub-label, superseded — kept because the sub-label
may be wanted again at a size where its 9px tracking is legible.

## Still to do

Outline the glyphs. Both files are live `<text>`, so they depend on a font being
present wherever they are opened. That is fine for a reference copy and wrong
for anything handed to a printer or a third party.
