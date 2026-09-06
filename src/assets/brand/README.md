# VKM brand artwork

The four supplied files, as drawn. **These are the reference, not build inputs** —
nothing imports them.

| file | ground | V / M | K | keyline |
|---|---|---|---|---|
| `vkm-monogram-navy.svg` | light | `#002B49` | `#89CFF0` | `#FFFFFF` |
| `vkm-wordmark-navy.svg` | light | `#002B49` | `#89CFF0` | `#FFFFFF` |
| `vkm-monogram-white.svg` | dark | `#FFFFFF` | `#BCE8FF` | `#002B49` |
| `vkm-wordmark-white.svg` | dark | `#FFFFFF` | `#BCE8FF` | `#002B49` |

The wordmarks add a `LEGAL` sub-label (14px, weight 500, tracked 9, `#1A6B8A`)
on a y=180 baseline and sit in a 420×200 viewBox; the monograms are the three
glyphs alone on a y=130 baseline in 420×160. Each file's C2PA metadata block was
stripped — about 8KB of base64 that is provenance for the file rather than part
of the drawing.

Note the white pair's K is `#BCE8FF`, which is this site's `--accent` exactly.

## What the site renders instead, and why

`src/assets/VkmLogo.tsx` and `public/favicon.svg` are drawn as paths on a shared
48-unit grid. They are not these files, for two reasons that are properties of
the artwork:

**The files name no `font-family`.** Opened anywhere they render in whatever the
browser defaults to — Times, on most. Shipped as-is for one revision, the site's
header read as a serif next to a page set in a geometric sans.

**The glyphs are positioned for a face the files do not name.** At x=108/172/240
they already overlap in every face measured here — V→K by 2.3 units and K→M by
8.7 — before the 8px keyline widens each of them by a further 8 per side. The
white strokes then run together. At favicon sizes the whole mark closes into a
single dot.

Both are fixable only by changing the artwork, which is the client's call. Until
then the drawn version keeps what the mark is actually about — three monolinear
letters with the middle one picked out in a lighter blue — and drops what does
not survive the move to screen: the keyline, and the hardcoded spacing.

## Still to do

**Outline the glyphs.** All four files are live `<text>`, so they depend on a
font being present wherever they are opened. Fine for a reference copy; wrong
for anything handed to a printer or a third party. Doing that would also settle
the spacing question, since outlines carry their own positions.

**Decide whether the white pair should replace the drawn mark on this site.**
It is the dark-ground variant and its colours are right for this page — white on
`#0F1A2E` rather than the navy pair's ~1.3:1 — so once the font and spacing are
fixed, rendering the artwork directly becomes viable in a way the navy pair
never was here.
