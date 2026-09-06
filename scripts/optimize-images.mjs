// Image optimization pipeline — responsive, multi-format variant generator.
//
// Emits SEPARATE variant files under src/assets/images/ (it does NOT overwrite
// its own sources), so the script is idempotent: re-running produces the same
// bytes because every source is distinct from every output.
//
// Run with: npm run optimize:images
//
// ── Sources ──────────────────────────────────────────────────────────────────
//   Hero statue: the pristine 3584x4800 master lives ONLY in git history at
//   commit 9609ba1 (`git show 9609ba1:src/assets/images/hero-statue.webp`).
//   We extract it via `git show` into a memory buffer and downscale from it so
//   every variant comes from the highest-quality source. If that extraction
//   fails (shallow clone, detached history, etc.) we fall back to the on-disk
//   hero-statue.webp, which is the already-optimized 1400px q78 export — good
//   enough to produce the 1400/1050/700 variants without visible loss.
//
//   hero-statue.webp therefore stays on disk as the on-disk fallback source of
//   record; it is intentionally NOT imported by the app anymore (the six hashed
//   variant files are what ship).
//
//   Partner portraits: their sources are only 512x512. The existing
//   .jpg files are already mozjpeg-optimized (q85 / q75) and double as the
//   <img> fallback the components reference, so we leave them untouched and only
//   emit an AVIF sibling. (Re-encoding them in place every run would both drift
//   the bytes — breaking idempotency — and accrue generation loss for zero gain,
//   since there is no higher-resolution source to recover detail from.)
//
// ── AVIF ─────────────────────────────────────────────────────────────────────
//   sharp .avif({ quality ~50-55, effort: 6 }) typically matches webp q78 / jpeg
//   q85 visually at a fraction of the bytes. For each asset we compare the AVIF
//   against its same-width fallback and SKIP (delete) the AVIF if it comes out
//   larger — which happens on some low-entropy content where AVIF's overhead
//   isn't worth it. Skips are reported.

import { readFile, writeFile, stat, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const imagesDir = resolve(repoRoot, 'src', 'assets', 'images');

const KB = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

/** Rows for the final size table: { file, bytes, note } */
const table = [];
/** Human-readable notes about skipped AVIF outputs. */
const skipped = [];

/**
 * Resolve the source buffer for the statue: prefer the pristine master from
 * git, fall back to the on-disk optimized copy.
 * @returns {Promise<{ buffer: Buffer, origin: string }>}
 */
async function loadStatueSource() {
  const rev = '9609ba1';
  const gitPath = 'src/assets/images/hero-statue.webp';
  try {
    const buffer = execFileSync('git', ['show', `${rev}:${gitPath}`], {
      cwd: repoRoot,
      maxBuffer: 1024 * 1024 * 128,
    });
    return { buffer, origin: `git ${rev} (pristine 3584px master)` };
  } catch {
    const diskPath = join(imagesDir, 'hero-statue.webp');
    const buffer = await readFile(diskPath);
    return { buffer, origin: 'on-disk hero-statue.webp (1400px fallback)' };
  }
}

/**
 * Encode `buffer` to a file at `outName`, optionally resized to `width`.
 * @returns {Promise<number>} bytes written
 */
async function encode(buffer, outName, { width, format, options }) {
  let pipeline = sharp(buffer);
  if (width) {
    pipeline = pipeline.resize({ width, withoutEnlargement: true });
  }
  if (format === 'webp') pipeline = pipeline.webp(options);
  else if (format === 'avif') pipeline = pipeline.avif(options);
  else if (format === 'jpeg') pipeline = pipeline.jpeg({ mozjpeg: true, ...options });

  const out = await pipeline.toBuffer();
  await writeFile(join(imagesDir, outName), out);
  return out.length;
}

// ── Statue: multi-width AVIF + WebP ──────────────────────────────────────────
// Widths cover the ~684px desktop display up to ~2 DPR and the near-full-width
// mobile display up to ~3 DPR.
async function buildStatue() {
  const { buffer, origin } = await loadStatueSource();
  console.log(`  statue source: ${origin}`);

  const widths = [700, 1050, 1400];
  const webpQ = { quality: 78 };
  const avifQ = { quality: 52, effort: 6 };

  for (const w of widths) {
    // WebP first — it is the fallback we measure AVIF against.
    const webpName = `hero-statue-${w}.webp`;
    const webpBytes = await encode(buffer, webpName, { width: w, format: 'webp', options: webpQ });
    table.push({ file: webpName, bytes: webpBytes });

    // AVIF — keep only if meaningfully smaller than the WebP at the same width.
    const avifName = `hero-statue-${w}.avif`;
    const avifBytes = await encode(buffer, avifName, { width: w, format: 'avif', options: avifQ });
    if (avifBytes >= webpBytes) {
      await unlink(join(imagesDir, avifName));
      skipped.push(`${avifName} (${KB(avifBytes)} >= ${KB(webpBytes)} WebP) — AVIF not smaller, skipped`);
    } else {
      table.push({ file: avifName, bytes: avifBytes });
    }
  }
}

// ── Single-size assets: keep the optimized JPEG, add an AVIF sibling ──────────
async function buildSingle(baseName, avifOptions) {
  const jpgName = `${baseName}.jpg`;
  const jpgPath = join(imagesDir, jpgName);

  let jpgBytes;
  try {
    jpgBytes = (await stat(jpgPath)).size;
  } catch {
    console.warn(`  skip  ${jpgName} (source not found)`);
    return;
  }
  // Report the existing JPEG fallback (left untouched) for completeness.
  table.push({ file: jpgName, bytes: jpgBytes, note: 'existing fallback, unchanged' });

  const source = await readFile(jpgPath);
  const avifName = `${baseName}.avif`;
  const avifBytes = await encode(source, avifName, { format: 'avif', options: avifOptions });
  if (avifBytes >= jpgBytes) {
    await unlink(join(imagesDir, avifName));
    skipped.push(`${avifName} (${KB(avifBytes)} >= ${KB(jpgBytes)} JPEG) — AVIF not smaller, skipped`);
  } else {
    table.push({ file: avifName, bytes: avifBytes });
  }
}

async function run() {
  await buildStatue();
  await buildSingle('partner-male', { quality: 55, effort: 6 });
  await buildSingle('partner-female', { quality: 55, effort: 6 });

  console.log('\n  file                         size');
  console.log('  ----------------------------------------');
  let total = 0;
  for (const row of table) {
    total += row.bytes;
    const note = row.note ? `  (${row.note})` : '';
    console.log(`  ${row.file.padEnd(26)} ${KB(row.bytes).padStart(10)}${note}`);
  }
  console.log('  ----------------------------------------');
  console.log(`  ${'total'.padEnd(26)} ${KB(total).padStart(10)}`);

  if (skipped.length) {
    console.log('\n  AVIF skipped:');
    for (const s of skipped) console.log(`    - ${s}`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
