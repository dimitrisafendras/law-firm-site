import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const execFileAsync = promisify(execFile);

// Lossless WebP that keeps the colour of fully transparent pixels (`-exact`).
// Those pixels are painted the wire colour on purpose (texture() in build-hero-rive.mjs): Rive
// uploads textures unpremultiplied, so bilinear sampling at a fragment's edge
// blends toward whatever colour sits under alpha 0. Encoders discard it by
// default — sharp's WebP encoder always does — and the edges went soft and
// dark. cwebp with -exact is byte-identical to the PNG at about half the size.
export async function toWebp(png){
  const dir=mkdtempSync(join(tmpdir(),'hero-webp-'));
  try {
    writeFileSync(join(dir,'in.png'),png);
    await execFileAsync('cwebp',['-quiet','-lossless','-exact','-z','9',join(dir,'in.png'),'-o',join(dir,'out.webp')]);
    return readFileSync(join(dir,'out.webp'));
  } finally { rmSync(dir,{recursive:true,force:true}); }
}
