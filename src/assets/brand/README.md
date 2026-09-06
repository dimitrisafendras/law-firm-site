# VKM brand artwork

The four supplied files, as drawn. **These are the reference; two cropped
derivatives beside them in `src/assets/` are what the site imports.**

| file | ground | V / M | K | keyline | LEGAL |
|---|---|---|---|---|---|
| `vkm-legal-navy.svg` | light | `#002B49` | `#89CFF0` | `#FFFFFF` | `#1A6B8A` |
| `vkm-legal-white.svg` | dark | `#FFFFFF` | `#BCE8FF` | `#002B49` | `#FFFFFF` |
| `vkm-monogram-navy.svg` | light | `#002B49` | `#89CFF0` | `#FFFFFF` | — |
| `vkm-monogram-white.svg` | dark | `#FFFFFF` | `#BCE8FF` | `#002B49` | — |

The `legal` pair adds the `LEGAL` sub-label and sits in a 420x200 viewBox; the
monograms are the three glyphs alone in 420x160. Each file's C2PA manifest was
stripped — about 10KB of base64 that is provenance for the file rather than part
of the drawing, and would otherwise ship on every page load. Nothing else was
changed.

The white pair's K is `#BCE8FF`, which is this site's `--accent` exactly.

## These replaced an earlier set, and the difference is the whole point

The previous artwork was live `<text>` naming no `font-family`. A drawing like
that depends on a font being present wherever it is opened, and it renders in
whatever the browser defaults to otherwise — Times, here. Worse, the glyphs were
positioned by hand at x=108/172/240 for a face the file did not name, so they
overlapped in every face measured and the 8px keyline ran the outlines together
into a smudge.

**These are outlined paths.** No font dependency, no hand-placed spacing, and
the keyline does the job it was drawn for: on a dark ground it is navy against
navy, so where the glyphs overlap it reads as a cut between them rather than an
outline around them — which is what "keyline interlock" means.

That also settled how the site loads them. The old files had to be inlined into
`VkmLogo.tsx`, because an SVG loaded through `<img>` is an isolated document
that gets none of the page's webfonts, and inlining was the only way to get the
site's own face into the sub-label. Outlines need no face, so the mark is an
`<img>` again — which page CSS cannot reach into and repaint.

## Measurements

Taken with `getBBox` in the browser. It excludes stroke, so the keyline adds 4
units on every side of the glyph group; the LEGAL row carries no stroke.

| | ink (keyline included) | crop used by the site |
|---|---|---|
| legal | x 95.34–324.66, y 59–184.01 | `95.34 59 229.32 125.01` |
| monogram | x 95.34–324.66, y 49–135.32 | `95.34 49 229.32 86.32` |

Two consequences worth knowing before changing any size:

- **The boxes are not interchangeable at a given CSS height.** The monogram's
  box is the glyphs and nothing else; the wordmark's also carries LEGAL and the
  air above it. So `glyph = height x 86.32/125.01` for the wordmark and
  `glyph = height` for the monogram — the same `height` draws the monogram's
  letters about 45% larger. `src/App.css` sizes the navbar around that.
- **LEGAL is small and right-aligned.** It is 14.43 units tall, so it renders at
  6.5px in the 56px navbar and 8.3px in the 72px footer, and it sits under the
  K and M rather than centred beneath the whole mark. Both are how the artwork
  is drawn. Changing either means changing the artwork, which is the client's
  call and not the stylesheet's.

## Not used by the favicon

`public/favicon.svg` is drawn geometry, deliberately. A favicon document gets
neither the stylesheet nor a second chance at legibility, and three interlocked
glyphs close into a single dot at 16px.
