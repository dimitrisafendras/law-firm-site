# VKM brand artwork

The four supplied files, as drawn. **These are the reference; two cropped
derivatives beside them in `src/assets/` are what the site imports.**

| file | ground | V / M | K | LEGAL |
|---|---|---|---|---|
| `vkm-legal-navy.svg` | light | `#002B49` | `#89CFF0` | `#1A6B8A` |
| `vkm-legal-white.svg` | dark | `#FFFFFF` | `#BCE8FF` | `#FFFFFF` |
| `vkm-monogram-navy.svg` | light | `#002B49` | `#89CFF0` | — |
| `vkm-monogram-white.svg` | dark | `#FFFFFF` | `#BCE8FF` | — |

The `legal` pair adds the `LEGAL` sub-label in a 420x200 viewBox; the monograms
are the three glyphs alone in 420x160. Each file's C2PA manifest was stripped —
about 8KB of base64 that is provenance for the file rather than part of the
drawing, and would otherwise ship on every page load. Nothing else was changed.

The white pair's K is `#BCE8FF`, which is this site's `--accent` exactly.

## How the interlock works, and why it matters downstream

There is **no keyline stroke**. Each `<defs>` block holds two masks: the K's
outline, dilated by a 10-unit stroke, is masked *out* of the V, and the M's is
masked out of the K. Where the letters overlap the drawing is therefore
transparent, and whatever is behind the mark shows through the gap.

That is a better mark on this site than the painted-outline version it replaced
— the cut reads as the page rather than as a navy line drawn around each glyph,
and it works on any ground rather than only the one the keyline was coloured
for. It also has a consequence worth knowing before touching any size: because
the interlock cuts inward instead of painting outward, the ink is exactly the
path geometry. An earlier set carried an 8px stroke outside the outline, adding
4 units on every side, so **every crop and ratio here was re-measured rather
than carried across** when these landed.

## Measurements

Taken with `getBBox` in the browser, excluding the mask definitions (their
rects are 700x520 and would swamp the box).

| | ink | crop used by the site |
|---|---|---|
| legal | x 99.34–320.66, y 63–184.01 | `99.34 63 221.32 121.01` |
| monogram | x 99.34–320.66, y 53–131.32 | `99.34 53 221.32 78.32` |

Both crops carry 78.32 units of glyph. The wordmark's box is 121.01 tall
because it also holds the LEGAL row and the air above it; the monogram's box is
the glyphs and nothing else. So:

    wordmark:  glyph = height x 78.32/121.01
    monogram:  glyph = height

which means the same CSS `height` draws the monogram's letters ~55% larger.
`src/App.css` sizes the navbar around that and carries the arithmetic. Measured
in place: 36.2px glyphs unscrolled at 56px, 33px scrolled (0.91x), 46.6px in
the 72px footer.

**LEGAL is small and right-aligned.** It is 14.43 units tall, so it renders at
6.7px in the navbar and 8.6px in the footer, and it sits under the K and M
rather than centred beneath the whole mark. Both are how the artwork is drawn.
Changing either means changing the artwork, which is the client's call and not
the stylesheet's.

## Why the site loads these as `<img>`

The glyphs are outlined `<path>` data, so nothing here depends on a font being
installed. An SVG loaded through `<img>` is an isolated document that gets none
of the embedding page's webfonts — which is fatal for artwork built from live
`<text>` (an earlier set was, and rendered in Times), and irrelevant for
outlines.

With no reason left to inline, the reason not to stands: markup in the page is
markup page CSS can reach into and repaint, which is how one revision shipped
something that was not the client's logo. An `<img>` cannot be reached into.

## Not used by the favicon

`public/favicon.svg` is drawn geometry, deliberately. A favicon document gets
neither the stylesheet nor a second chance at legibility, and three interlocked
glyphs close into a single dot at 16px.
