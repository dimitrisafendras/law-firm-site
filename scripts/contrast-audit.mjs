/**
 * WCAG contrast audit, measured against the pixels the site actually paints.
 *
 * ── Why this is not a token check ────────────────────────────────────────────
 *
 * Every colour in this project is a token, so it is tempting to audit contrast
 * by arithmetic: read `--accent-text` and `--bg` out of the generated
 * stylesheet, divide, done. That answer is wrong often enough to be dangerous,
 * because `--bg` is the kindest ground on the site and almost nothing sits on
 * it. The hero paints its copy on `--hero-deep`. A `.glass` card is lit by the
 * page ramp's accent blooms and comes out lighter than `--bg` on the dark
 * palettes. The navbar and the contact fields pull a photograph up through a
 * `backdrop-filter`. Colours that measured 6:1 against the token have measured
 * 4.1:1 against the pixels — under AA, on a page that a token check calls fine.
 *
 * So this drives a real browser, screenshots what it renders, and samples the
 * pixels actually behind each glyph.
 *
 * ── What it measures ─────────────────────────────────────────────────────────
 *
 * For every palette × route × scroll position:
 *
 *   - every element with a text node of its own, against 4.5:1 (or 3:1 where
 *     WCAG counts the text as large: ≥24px, or ≥18.66px at weight 700+);
 *   - every control's drawn border, against 1.4.11's 3:1 for the boundary of a
 *     user interface component.
 *
 * The "background" for a text element is not one colour, because photographs
 * and gradients are not one colour. The element's box is sampled, the pixels
 * closest to the glyph colour are discarded as glyph, and what remains is read
 * at the 5th, 50th and 95th luminance percentile. The worst of those three is
 * the reported ratio — a label is only as legible as its worst patch.
 *
 * ── Two ways this lies, both handled ─────────────────────────────────────────
 *
 * An element inside the viewport can still be painted over. The header is
 * fixed, so anything scrolled under it samples the header's glass rather than
 * its own ground: the contact icons measured 3.24:1 that way and are actually
 * 5.46:1. Hence `unoccluded()`. The inverse error is rejecting too much — a
 * transparent overlay is not occlusion, and treating the partner card's
 * whole-card click target as one silently dropped a real failure out of the
 * audit — hence the walk that ignores anything that paints nothing.
 *
 * And `page.goto()` to a URL differing only by `#hash` is a same-document
 * navigation: it does not reload, `ThemeProvider` never re-mounts, and every
 * hash route renders the PREVIOUS palette under the current one's name. Hence
 * the explicit reload, and the assertion on `data-theme` that turns a silent
 * mislabelling into a crash.
 *
 * ── Running it ───────────────────────────────────────────────────────────────
 *
 *   npm run dev                       # in another terminal; this needs a server
 *   npm run audit:contrast            # all palettes, the default routes
 *   npm run audit:contrast -- --mobile
 *   npm run audit:contrast -- --palettes=marble,obsidian --routes=/,#login
 *   npm run audit:contrast -- --json=audit.json --shots=./shots
 *
 * Exits non-zero if anything is below threshold, so it can gate a pipeline.
 *
 * Needs a Chromium for Playwright: `npx playwright install chromium`. Failing
 * that it falls back to the Chrome installed on the machine (`--channel`).
 */

import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(new URL('.', import.meta.url)));

/* ─── Options ─────────────────────────────────────────────────────────────── */

function parseArgs(argv) {
  const opts = {
    url: 'http://localhost:5173/law-firm-site/',
    routes: ['', '#login', '#signup', '#partner/1', '#practice/corporate'],
    palettes: null, // null = every palette in the generated stylesheet
    viewport: { width: 1728, height: 900 },
    json: null,
    shots: null,
    quiet: false,
  };
  for (const arg of argv) {
    const [key, value] = arg.replace(/^--/, '').split('=');
    if (key === 'mobile') opts.viewport = { width: 390, height: 844 };
    else if (key === 'url') opts.url = value;
    else if (key === 'routes') opts.routes = value.split(',').map((r) => (r === '/' ? '' : r));
    else if (key === 'palettes') opts.palettes = value.split(',');
    else if (key === 'json') opts.json = value;
    else if (key === 'shots') opts.shots = value;
    else if (key === 'quiet') opts.quiet = true;
    else if (key === 'width') opts.viewport.width = Number(value);
    else if (key === 'height') opts.viewport.height = Number(value);
    else throw new Error(`unknown option --${key}`);
  }
  return opts;
}

/**
 * The palette ids, read from the generated stylesheet rather than from
 * palettes.ts — this is a plain .mjs and cannot import TypeScript, and the
 * stylesheet is regenerated from those seeds anyway, so it cannot drift.
 */
function palettesFromStylesheet() {
  const file = path.join(ROOT, 'src/theme/theme.generated.css');
  if (!fs.existsSync(file)) {
    throw new Error(`${file} is missing — run \`npm run generate:theme\` first.`);
  }
  const css = fs.readFileSync(file, 'utf8');
  const ids = [...css.matchAll(/:root\[data-theme='([a-z0-9-]+)'\]/g)].map((m) => m[1]);
  return [...new Set(ids)];
}

/* ─── Colour maths ────────────────────────────────────────────────────────── */

/** sRGB channel to linear light, per WCAG's own definition. */
function toLinear(channel) {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance([r, g, b]) {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrast(a, b) {
  const [hi, lo] = luminance(a) >= luminance(b) ? [a, b] : [b, a];
  return (luminance(hi) + 0.05) / (luminance(lo) + 0.05);
}

/** `fg` at `alpha` composited over `bg`. */
function over(fg, bg, alpha) {
  return [0, 1, 2].map((i) => fg[i] * alpha + bg[i] * (1 - alpha));
}

function squaredDistance(a, b) {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

/** oklab → sRGB. Browsers report `color-mix(in oklab, …)` in its own space. */
function oklabToSrgb(L, a, b) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  const encode = (x) => {
    const c = Math.min(1, Math.max(0, x));
    return 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
  };
  return [...linear.map(encode), 1];
}

/** Any colour the browser hands back, as `[r, g, b, a]`. `null` if unreadable. */
function parseColor(value) {
  const text = String(value).trim();
  const oklab = text.match(/^oklab\(([^)]+)\)/);
  if (oklab) {
    const [L, a, b] = oklab[1].replace(/\//g, ' ').split(/[\s,]+/).filter(Boolean).map(Number);
    return oklabToSrgb(L, a, b);
  }
  const hex = text.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const rgb = text.match(/^rgba?\(([^)]+)\)/);
  if (rgb) {
    const p = rgb[1].replace(/\//g, ' ').split(/[\s,]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p[3] ?? 1];
  }
  return null;
}

/* ─── What to collect, evaluated in the page ──────────────────────────────── */

/**
 * Serialised into the browser, so it must be self-contained — no imports, no
 * closure over anything out here.
 */
const COLLECT = () => {
  const CONTROLS = [
    'button', '.btn', 'input', 'textarea', 'select',
    '.icon-toggle', '.auth-nav__avatar', '.theme-picker__trigger', '.palette-chip',
    '[role="radio"]', '[role="switch"]', '[role="tab"]',
  ].join(', ');

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const describe = (el) => {
    const parts = [];
    for (let n = el; n && n.nodeType === 1 && parts.length < 4; n = n.parentElement) {
      const cls = String(n.className || '').trim().split(/\s+/)[0];
      parts.unshift(cls ? `${n.tagName.toLowerCase()}.${cls}` : n.tagName.toLowerCase());
    }
    return parts.join('>');
  };

  /* An ancestor fading a subtree makes its text unmeasurable, not low-contrast:
     the navbar defers its call to action in and out by opacity, and measuring
     it at zero reads the page behind it. Sections also fade in on scroll, and
     an element caught halfway through that is not a contrast failure either —
     WCAG judges the resting state. So anything not fully opaque is skipped
     rather than measured; it will be measured at the next scroll step, or on
     the palette after, by which time its animation has settled. */
  const effectiveOpacity = (el) => {
    let value = 1;
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      value *= Number(getComputedStyle(n).opacity);
    }
    return value;
  };

  const inViewport = (r) =>
    r.top >= 0 && r.left >= 0 && r.bottom <= vh && r.right <= vw && r.width >= 3 && r.height >= 3;

  /* Does this element paint anything of its own? A transparent wrapper does
     not hide what is under it. */
  const paints = (el) => {
    const s = getComputedStyle(el);
    return (
      (s.backgroundColor && !/^rgba\(0, 0, 0, 0\)$|^transparent$/.test(s.backgroundColor)) ||
      s.backgroundImage !== 'none' ||
      Number(s.opacity) < 1 ||
      s.backdropFilter !== 'none'
    );
  };

  const unoccluded = (el, r) => {
    const pad = 2;
    const points = [
      [r.left + r.width / 2, r.top + r.height / 2],
      [r.left + pad, r.top + pad],
      [r.right - pad, r.top + pad],
      [r.left + pad, r.bottom - pad],
      [r.right - pad, r.bottom - pad],
    ];
    return points.every(([x, y]) => {
      const hit = document.elementFromPoint(x, y);
      if (!hit) return false;
      if (hit === el || el.contains(hit) || hit.contains(el)) return true;
      /* Walk the covering stack up to the nearest common ancestor. A hit whose
         own border box excludes the point came from a pseudo-element — this
         codebase draws overlays and underlines that way — so it tells us
         nothing about whether the host painted here. */
      for (let n = hit; n && n !== document.body && !n.contains(el); n = n.parentElement) {
        const b = n.getBoundingClientRect();
        const insideHost = x >= b.left && x <= b.right && y >= b.top && y <= b.bottom;
        if (insideHost && paints(n)) return false;
      }
      return true;
    });
  };

  const items = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.visibility !== 'visible' || cs.display === 'none') continue;
    const opacity = effectiveOpacity(el);
    if (opacity < 0.99) continue;

    const r = el.getBoundingClientRect();
    const ownsText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());

    if (ownsText && inViewport(r) && unoccluded(el, r)) {
      items.push({
        kind: 'text',
        path: describe(el),
        text: el.textContent.trim().slice(0, 30),
        color: cs.color,
        opacity,
        fontSize: parseFloat(cs.fontSize),
        fontWeight: cs.fontWeight,
        clip: cs.webkitBackgroundClip || cs.backgroundClip,
        ariaHidden: el.closest('[aria-hidden="true"]') ? 1 : 0,
        box: [r.x, r.y, r.width, r.height],
      });
    }

    if (el.matches(CONTROLS)) {
      const width = parseFloat(cs.borderTopWidth);
      const drawn = width > 0 && cs.borderTopStyle !== 'none';
      /* A control as wide as the page is a layout wrapper, not a boundary
         anyone is asked to perceive. */
      const boundary = r.width < vw * 0.9;
      if (drawn && boundary && inViewport(r) && unoccluded(el, r)) {
        items.push({
          kind: 'border',
          path: describe(el),
          text: el.textContent.trim().slice(0, 24) || el.tagName.toLowerCase(),
          color: cs.borderTopColor,
          opacity,
          fontSize: null,
          fontWeight: cs.fontWeight,
          clip: 'border-box',
          ariaHidden: 0,
          box: [r.x, r.y, r.width, r.height],
        });
      }
    }
  }
  return items;
};

/* ─── Measuring one frame ─────────────────────────────────────────────────── */

async function decode(buffer) {
  const { data, info } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels };
}

function pixelAt(image, x, y) {
  const i = (y * image.width + x) * image.channels;
  return [image.data[i], image.data[i + 1], image.data[i + 2]];
}

function percentile(sorted, q) {
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))];
}

/** WCAG's "large text": ≥24px, or ≥18.66px at 700 or heavier. */
function threshold(item) {
  if (item.kind === 'border') return 3;
  const size = item.fontSize;
  const bold = Number(item.fontWeight) >= 700;
  return size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
}

function measureFrame(image, frame) {
  const results = [];
  const unmeasurable = [];

  for (const item of frame.items) {
    const fg = parseColor(item.color);
    if (!fg || fg[3] < 0.05 || String(item.clip).includes('text')) {
      unmeasurable.push({ ...frame.meta, path: item.path, text: item.text, color: item.color });
      continue;
    }

    const [bx, by, bw, bh] = item.box;
    const x0 = Math.max(0, Math.round(bx));
    const y0 = Math.max(0, Math.round(by));
    const x1 = Math.min(image.width, Math.ceil(bx + bw));
    const y1 = Math.min(image.height, Math.ceil(by + bh));
    if (x1 - x0 < 3 || y1 - y0 < 3) continue;

    let samples;
    if (item.kind === 'text') {
      const pixels = [];
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) pixels.push(pixelAt(image, x, y));
      /* Discard the 45% of the box closest to the glyph colour. Text never
         covers more than that at these sizes, so what is left is ground. */
      pixels.sort((a, b) => squaredDistance(a, fg) - squaredDistance(b, fg));
      const ground = pixels.slice(Math.floor(pixels.length * 0.45)).sort((a, b) => luminance(a) - luminance(b));
      samples = [percentile(ground, 0.05), percentile(ground, 0.5), percentile(ground, 0.95)];
    } else {
      /* A border is measured against what surrounds the control, so sample the
         ring outside its box rather than its own interior. */
      const m = 5;
      const ring = [];
      for (let y = Math.max(0, y0 - m); y < Math.min(image.height, y1 + m); y++) {
        for (let x = Math.max(0, x0 - m); x < Math.min(image.width, x1 + m); x++) {
          if (x >= x0 && x < x1 && y >= y0 && y < y1) continue;
          ring.push(pixelAt(image, x, y));
        }
      }
      if (ring.length < 10) continue;
      ring.sort((a, b) => luminance(a) - luminance(b));
      samples = [percentile(ring, 0.5)];
    }

    const alpha = fg[3] * item.opacity;
    let worst = Infinity;
    let worstGround = null;
    for (const ground of samples) {
      const ratio = contrast(over(fg, ground, alpha), ground);
      if (ratio < worst) {
        worst = ratio;
        worstGround = ground;
      }
    }

    const need = threshold(item);
    results.push({
      ...frame.meta,
      kind: item.kind,
      path: item.path,
      text: item.text,
      color: item.color,
      fontSize: item.fontSize,
      ariaHidden: item.ariaHidden,
      ratio: Math.round(worst * 100) / 100,
      need,
      pass: worst >= need,
      ground: worstGround.map(Math.round),
    });
  }

  return { results, unmeasurable };
}

/* ─── Driving the browser ─────────────────────────────────────────────────── */

async function launch() {
  try {
    return await chromium.launch();
  } catch (cause) {
    /* No downloaded Chromium. The machine almost certainly has Chrome, and for
       a contrast measurement any Blink will do. */
    try {
      return await chromium.launch({ channel: 'chrome' });
    } catch {
      throw new Error(
        'No browser available. Run `npx playwright install chromium`, or install Google Chrome.',
        { cause },
      );
    }
  }
}

async function run(opts) {
  const palettes = opts.palettes ?? palettesFromStylesheet();
  const base = opts.url.endsWith('/') ? opts.url : `${opts.url}/`;

  const probe = await fetch(base).catch(() => null);
  if (!probe?.ok) {
    throw new Error(`Nothing serving ${base}. Start the dev server (\`npm run dev\`) first.`);
  }

  if (opts.shots) fs.mkdirSync(opts.shots, { recursive: true });

  const browser = await launch();
  const page = await browser.newPage({ viewport: opts.viewport, deviceScaleFactor: 1 });

  const results = [];
  const unmeasurable = [];
  let frames = 0;

  try {
    for (const palette of palettes) {
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.evaluate((id) => localStorage.setItem('law-firm-site:palette', id), palette);

      for (const route of opts.routes) {
        await page.goto(base + route, { waitUntil: 'networkidle' });
        /* See the header: a hash-only goto does not reload, so without this the
           page keeps the previous palette and every row is mislabelled. */
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForTimeout(900);

        const shown = await page.evaluate(() => document.documentElement.dataset.theme);
        if (shown !== palette) {
          throw new Error(`asked for palette "${palette}" but the page rendered "${shown}"`);
        }

        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        const step = Math.round(opts.viewport.height * 0.85);
        for (let y = 0, i = 0; y < height && i < 24; y += step, i++) {
          await page.evaluate((to) => window.scrollTo(0, to), y);
          await page.waitForTimeout(650);

          const items = await page.evaluate(COLLECT);
          if (!items.length) continue;

          const buffer = await page.screenshot();
          if (opts.shots) {
            const name = `${palette}-${(route || 'home').replace(/[^a-z0-9]/gi, '_')}-${i}.png`;
            fs.writeFileSync(path.join(opts.shots, name), buffer);
          }

          const image = await decode(buffer);
          const frame = { items, meta: { palette, route: route || 'home', step: i } };
          const measured = measureFrame(image, frame);
          results.push(...measured.results);
          unmeasurable.push(...measured.unmeasurable);
          frames++;
        }

        if (!opts.quiet) process.stderr.write(`  ${palette} ${route || 'home'}\n`);
      }
    }
  } finally {
    await browser.close();
  }

  return { results, unmeasurable, frames, palettes };
}

/* ─── Reporting ───────────────────────────────────────────────────────────── */

function report({ results, unmeasurable, frames, palettes }, opts) {
  /* One row per element per route, keeping its worst palette — the same label
     failing on nine palettes is one problem, not nine. */
  const worstOf = new Map();
  for (const r of results) {
    const key = `${r.route}|${r.path}|${r.kind}`;
    const held = worstOf.get(key);
    if (!held || r.ratio < held.ratio) worstOf.set(key, r);
  }

  const failures = [...worstOf.values()].filter((r) => !r.pass).sort((a, b) => a.ratio - b.ratio);

  console.log(
    `\n${results.length} measurements over ${frames} frames, ` +
      `${palettes.length} palettes, ${worstOf.size} distinct elements — ` +
      `${failures.length} failing\n`,
  );

  if (unmeasurable.length) {
    const seen = new Set();
    console.log('Unmeasurable (transparent colour, or painted through background-clip:text):');
    for (const u of unmeasurable) {
      const key = `${u.path}|${u.text}`;
      if (seen.has(key)) continue;
      seen.add(key);
      console.log(`   ${u.route.padEnd(20)} ${u.path}  ${JSON.stringify(u.text)}`);
    }
    console.log();
  }

  if (failures.length) {
    console.log('ratio  need  route                element                                   text');
    for (const r of failures) {
      const flag = r.ariaHidden ? ' [aria-hidden]' : '';
      console.log(
        `${String(r.ratio).padStart(5)}  ${String(r.need).padStart(4)}  ` +
          `${r.route.padEnd(20)} ${r.path.slice(-40).padEnd(41)} ` +
          `${JSON.stringify(r.text).slice(0, 26).padEnd(28)} ${r.palette}${flag}`,
      );
    }
    console.log();
  } else {
    const tightest = [...worstOf.values()].sort((a, b) => a.ratio / a.need - b.ratio / b.need).slice(0, 8);
    console.log('Tightest margins:');
    for (const r of tightest) {
      console.log(
        `${String(r.ratio).padStart(6)} / ${r.need}  ${r.route.padEnd(20)} ` +
          `${r.path.split('>').pop().slice(0, 34).padEnd(36)} ${r.palette}`,
      );
    }
    console.log();
  }

  if (opts.json) {
    fs.writeFileSync(opts.json, JSON.stringify({ results, unmeasurable }, null, 1));
    console.log(`Wrote ${opts.json}\n`);
  }

  return failures.length;
}

/* ─── Entry ───────────────────────────────────────────────────────────────── */

const opts = parseArgs(process.argv.slice(2));
const audit = await run(opts);
process.exit(report(audit, opts) ? 1 : 0);
