// Postbuild prerender step.
//
// After `vite build` produces the client bundle in dist/, this script renders
// the app to a static HTML string and injects it into dist/index.html's
// <div id="root">. That makes the hero, the LCP statue <picture>, and all
// section copy present in the initial HTML response — discoverable by crawlers
// and paintable before the ~78 KB main bundle loads. main.tsx then hydrates the
// prerendered markup in place.
//
// Approach: a throwaway Vite SSR build of src/entry-server.tsx into a temp
// outDir (reusing vite.config.ts — same aliases, plugins, env), imported and
// invoked here, then cleaned up. Using Vite's JS `build()` API (rather than
// shelling out) keeps this portable across Windows/macOS/Linux.
//
// Wired as the npm `postbuild` hook, so it runs automatically after
// `npm run build`.

import { build } from 'vite';
import { readFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const ssrOutDir = join(root, 'dist-ssr');
const indexPath = join(root, 'dist', 'index.html');

async function main() {
  // 1. Build the server entry to a temporary directory.
  await build({
    root,
    logLevel: 'warn',
    build: {
      ssr: 'src/entry-server.tsx',
      outDir: 'dist-ssr',
      emptyOutDir: true,
      // Keep the client build's reporting out of this pass.
      reportCompressedSize: false,
    },
  });

  // 2. Locate the emitted server bundle (Vite names it after the entry file).
  const emitted = readdirSync(ssrOutDir).filter((f) => f.endsWith('.js'));
  const serverFile =
    emitted.find((f) => f.startsWith('entry-server')) ?? emitted[0];
  if (!serverFile) {
    throw new Error(`prerender: no server bundle emitted in ${ssrOutDir}`);
  }

  // 3. Render the app to an HTML string.
  const { render } = await import(
    pathToFileURL(join(ssrOutDir, serverFile)).href
  );
  const appHtml = render();
  if (!appHtml || typeof appHtml !== 'string') {
    throw new Error('prerender: render() returned no HTML');
  }

  // 4. Inject the markup into the empty root container in dist/index.html.
  const template = readFileSync(indexPath, 'utf-8');
  const rootRe = /<div id="root">\s*<\/div>/;
  if (!rootRe.test(template)) {
    throw new Error(
      'prerender: could not find <div id="root"></div> in dist/index.html',
    );
  }
  const out = template.replace(rootRe, `<div id="root">${appHtml}</div>`);
  writeFileSync(indexPath, out);

  // 5. Clean up the throwaway SSR build.
  rmSync(ssrOutDir, { recursive: true, force: true });

  console.log(
    `  ok    prerendered dist/index.html  (+${appHtml.length} chars injected)`,
  );
}

main().catch((err) => {
  console.error('prerender failed:', err);
  process.exitCode = 1;
});
