// Normalise the client logos into one set that can be presented as one set.
//
// They arrive from eight different websites in eight different states: two are
// opaque rectangles (a JPEG and an RGB PNG) that would show as slabs, three are
// near-white artwork that vanishes on the nine light palettes, three are
// near-black artwork that vanishes on the nine dark ones. Measured:
//
//   cityskal.jpg         100% opaque, ink L 0.764   white slab
//   starboard.png        100% opaque, ink L 0.808   white slab
//   evivios.png           alpha, ink L 0.956        dies on light grounds
//   goat.png              alpha, ink L 0.983        dies on light grounds
//   psi-white.png         alpha, ink L 0.878        dies on light grounds
//   padel.png             alpha, ink L 0.540
//   psi.png               alpha, ink L 0.100        dies on dark grounds
//   karras.png            alpha, ink L 0.036        dies on dark grounds
//   starboard-mark.png    alpha, ink L 0.031        dies on dark grounds
//
// Nothing that keeps those colours works across eighteen palettes and the rungs
// between them, so the wall is monochrome: the page tints them with a filter,
// the way it already tints the social icons and the wordmark per scheme. That
// only needs the ALPHA to be right, which is what this script fixes — it keys
// the flat background out of the two opaque files, trims the transparent
// margin off every file so they can be optically sized against each other, and
// writes one normalised PNG per client.
//
// Run with: node scripts/prepare-client-logos.mjs
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// Sources and outputs live in separate directories ON PURPOSE. They shared one
// directory for exactly one run, and because several clients' output name
// matched their source name the script overwrote its own inputs: the second
// run keyed an already-keyed Starboard, read its now-transparent corners as
// the background colour, and ate the halftone globe out of the middle of the
// mark. Anything that rewrites its input is one accidental re-run away from
// silently degrading an asset it cannot rebuild.
const SRC = join(ROOT, 'src/assets/images/clients/original');
const OUT = join(ROOT, 'src/assets/images/clients');

/** Rendered at 2x of a ~44px row so the wall stays crisp on a retina screen. */
const TARGET_HEIGHT = 88;

/**
 * Which file each client is built from, and whether its background has to be
 * keyed out first.
 *
 * Where a site offered both a dark and a light version the DARK one is taken:
 * the tint is applied by filter and only the alpha survives, so the choice is
 * really about which file has the cleaner edges, and the light versions here
 * are the ones with halos from being drawn for a dark background.
 */
const SOURCES = [
  { id: 'develor', file: 'develor.svg', vector: true },
  { id: 'karras', file: 'karras.png' },
  { id: 'starboard', file: 'starboard.png', key: true },
  { id: 'evivios', file: 'evivios-inverse.png' },
  { id: 'goat', file: 'goat.png' },
  { id: 'cityskal', file: 'cityskal.jpg', key: true },
  { id: 'psi', file: 'psi.png' },
  { id: 'padel', file: 'padel.png' },
];

/**
 * Turn a flat background into transparency.
 *
 * The corner pixels decide what the background IS — reading it rather than
 * assuming white, because a logo saved on an off-white or a tinted plate is
 * common and keying pure white off it leaves a visible fringe. Anything within
 * `tolerance` of that colour becomes transparent, and pixels near the boundary
 * get partial alpha so the edge does not come out jagged.
 */
async function keyBackground(buffer, tolerance = 48) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const at = (x, y) => {
    const i = (y * width + x) * channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const corners = [at(0, 0), at(width - 1, 0), at(0, height - 1), at(width - 1, height - 1)];
  const bg = [0, 1, 2].map((c) => Math.round(corners.reduce((s, p) => s + p[c], 0) / corners.length));

  const spread = Math.max(
    ...corners.map((p) => Math.max(...[0, 1, 2].map((c) => Math.abs(p[c] - bg[c])))),
  );
  if (spread > 24) {
    throw new Error(
      `corners disagree by ${spread} — this image has no flat background to key, ` +
        'so keying it would eat part of the artwork',
    );
  }

  for (let i = 0; i < data.length; i += channels) {
    const d = Math.max(
      Math.abs(data[i] - bg[0]),
      Math.abs(data[i + 1] - bg[1]),
      Math.abs(data[i + 2] - bg[2]),
    );
    if (d <= tolerance) {
      // Feather the last quarter of the tolerance band rather than cutting at
      // it, which is what keeps type edges from going to staircase.
      const soft = Math.max(0, d - tolerance * 0.75) / (tolerance * 0.25);
      data[i + 3] = Math.round(Math.min(1, soft) * data[i + 3]);
    }
  }

  return sharp(data, { raw: { width, height, channels } }).png().toBuffer();
}

const results = [];

for (const source of SOURCES) {
  const from = join(SRC, source.file);
  let buffer = await readFile(from);

  if (source.vector) {
    // Rasterised at the target height from the vector, so the silhouette the
    // filter tints has clean edges rather than upscaled ones.
    buffer = await sharp(buffer, { density: 600 })
      .resize({ height: TARGET_HEIGHT * 2, fit: 'inside' })
      .png()
      .toBuffer();
  }

  if (source.key) buffer = await keyBackground(buffer);

  const out = await sharp(buffer)
    .ensureAlpha()
    // Trim the transparent margin: the files carry wildly different padding, so
    // without this a logo's apparent size on the wall is decided by its author's
    // export settings rather than by us.
    .trim({ threshold: 1 })
    .resize({ height: TARGET_HEIGHT, fit: 'inside', withoutEnlargement: false })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

  const meta = await sharp(out).metadata();
  const target = join(OUT, `${source.id}.png`);
  await writeFile(target, out);

  results.push({
    id: source.id,
    from: source.file,
    size: `${meta.width}x${meta.height}`,
    width: meta.width,
    height: meta.height,
    bytes: out.length,
    keyed: Boolean(source.key),
  });
}

// The manifest carries the INTRINSIC SIZE of each normalised file, which the
// component needs and must not guess. The logos are tinted with a CSS mask,
// and a masked element has no intrinsic size of its own -- it is a box the
// mask is painted into -- so the aspect ratio has to be stated somewhere.
// Written by hand it would be a set of numbers that silently stop matching the
// assets the first time a logo is re-cropped or replaced; generated here it
// cannot drift, because the same run writes both the image and the number.
const manifest = [
  '// AUTO-GENERATED by scripts/prepare-client-logos.mjs. Do not edit by hand.',
  '//',
  '// The intrinsic size of each normalised client logo. See that script for why',
  '// these are generated rather than written down, and ClientsSection.css for',
  '// what consumes them.',
  '',
  ...results.map((r) => `import ${r.id} from '@/assets/images/clients/${r.id}.png';`),
  '',
  'export interface ClientLogo {',
  '  id: string;',
  '  src: string;',
  '  width: number;',
  '  height: number;',
  '}',
  '',
  'export const CLIENT_LOGOS: Record<string, ClientLogo> = {',
  ...results.map(
    (r) =>
      `  ${r.id}: { id: '${r.id}', src: ${r.id}, width: ${r.width}, height: ${r.height} },`,
  ),
  '};',
  '',
].join('\n');

const manifestPath = join(ROOT, 'src/components/sections/ClientsSection/logos.generated.ts');
await mkdir(dirname(manifestPath), { recursive: true });
await writeFile(manifestPath, manifest, 'utf8');

console.log('id'.padEnd(12) + 'from'.padEnd(24) + 'out'.padEnd(12) + 'bytes'.padEnd(9) + 'keyed');
for (const r of results) {
  console.log(
    r.id.padEnd(12) + r.from.padEnd(24) + r.size.padEnd(12) +
      String(r.bytes).padEnd(9) + (r.keyed ? 'yes' : '-'),
  );
}
console.log(`\n${results.length} logos normalised to ${TARGET_HEIGHT}px tall.`);
console.log('manifest -> src/components/sections/ClientsSection/logos.generated.ts');
