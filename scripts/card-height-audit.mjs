/**
 * Card-height audit: every card in a set is the same height, in every locale,
 * at every width.
 *
 * ── Why this exists ──────────────────────────────────────────────────────────
 *
 * A row of cards whose heights disagree stops reading as a set. It is the kind
 * of break that only appears when the copy changes, so it survives review of
 * the change that caused it and shows up later, in the other language, on
 * someone else's screen.
 *
 * That is exactly how it got to production here. The rules that equalise the
 * practice bento and the partner row were written inside `min-width: 1280px`
 * gates, so the layouts were pixel-exact at the widest sizes — the ones they
 * were designed at — and drifted at every width below. Greek showed it worst,
 * because its descriptions and biographies wrap to more lines than the English,
 * but it was never a Greek problem: English drifted by up to 56px too.
 *
 * ── Why it drives a browser ──────────────────────────────────────────────────
 *
 * The same reason the contrast audit does. Equal heights are a property of what
 * the browser lays out, not of what the stylesheet says: they depend on the
 * grid's row sizing, on whether an intermediate wrapper passes its height down,
 * on `content-visibility` having realised the section, and on how the actual
 * font wraps the actual string. Nothing short of measuring boxes catches it.
 *
 * ── Two traps, both handled ──────────────────────────────────────────────────
 *
 * 1. Sections below the fold carry `content-visibility: auto` and report their
 *    reserved `contain-intrinsic-size`, not their real height, until they have
 *    been rendered. Measuring without scrolling the page first reports tidy
 *    identical numbers that are pure fiction. `realise()` walks the document.
 *
 * 2. The locale is chosen from localStorage at boot, so it has to be planted
 *    with `addInitScript` before the first paint. Setting it afterwards and
 *    re-reading gives the previous locale's layout under the new locale's name
 *    — the same shape of error the contrast audit hit with `#hash` routes.
 *
 * ── Usage ────────────────────────────────────────────────────────────────────
 *
 *   npm run audit:cards                     # needs a dev server on :5173
 *   npm run audit:cards -- --url=https://…  # or any deployed build
 *   npm run audit:cards -- --widths=1200,768 --langs=el
 *   npm run audit:cards -- --tolerance=2
 *
 * Exits non-zero on any group whose heights differ by more than the tolerance.
 */

import { chromium } from 'playwright';

/**
 * The card sets. `selector` must match every card in one set; they are compared
 * against each other and against nothing else.
 *
 * A set is a group the reader sees as one thing — the ten practice domains, the
 * three partners. Cards in different sets have no reason to match.
 */
const SETS = [
  { label: 'practice domains', selector: '.practice-domain', expect: 10 },
  { label: 'partner busts', selector: '.partner-ethos__bust', expect: 3 },
];

/**
 * Widths worth checking, chosen to sit either side of every breakpoint these
 * two layouts change at (1280 and 1024) rather than to sample evenly — a sweep
 * that misses 1200 and 1152 reports a clean bill on the exact band that was
 * broken.
 */
const WIDTHS = [1920, 1440, 1280, 1200, 1152, 1024, 900, 768, 430, 375];
const LANGS = ['en', 'el'];

/** 1px of sub-pixel rounding is not a design failure. Anything more is. */
const DEFAULT_TOLERANCE = 1;

function parseArgs(argv) {
  const opts = {
    url: 'http://localhost:5173/law-firm-site/',
    widths: WIDTHS,
    langs: LANGS,
    tolerance: DEFAULT_TOLERANCE,
    height: 900,
  };
  for (const arg of argv) {
    const [key, value] = arg.replace(/^--/, '').split('=');
    if (key === 'url') opts.url = value;
    else if (key === 'widths') opts.widths = value.split(',').map(Number);
    else if (key === 'langs') opts.langs = value.split(',');
    else if (key === 'tolerance') opts.tolerance = Number(value);
    else if (key === 'height') opts.height = Number(value);
  }
  return opts;
}

/**
 * Scroll the whole document so `content-visibility: auto` sections lay out for
 * real, then return to the top. One frame per step, so layout settles between
 * them rather than all at the end.
 */
async function realise(page) {
  await page.evaluate(async () => {
    const step = Math.max(300, Math.round(window.innerHeight * 0.6));
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => requestAnimationFrame(r));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    await new Promise((r) => requestAnimationFrame(r));
  });
}

async function measure(page, sets) {
  return page.evaluate((sets) => {
    return sets.map(({ label, selector, expect }) => {
      const els = [...document.querySelectorAll(selector)];
      const heights = els.map((el) => Math.round(el.getBoundingClientRect().height));
      return {
        label,
        selector,
        expect,
        found: heights.length,
        heights,
        spread: heights.length ? Math.max(...heights) - Math.min(...heights) : 0,
      };
    });
  }, sets);
}

const opts = parseArgs(process.argv.slice(2));
const browser = await chromium.launch();
const failures = [];
let checked = 0;

for (const width of opts.widths) {
  for (const lang of opts.langs) {
    const context = await browser.newContext({ viewport: { width, height: opts.height } });
    const page = await context.newPage();
    // Before first paint — see trap 2.
    await page.addInitScript((l) => {
      try {
        localStorage.setItem('lang', l);
      } catch {
        /* Private window with site data blocked; the default locale it is. */
      }
    }, lang);

    await page.goto(opts.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await realise(page);
    await page.waitForTimeout(600);

    for (const result of await measure(page, SETS)) {
      checked += 1;
      const where = `${String(width).padStart(4)}px ${lang}`;
      if (result.found === 0) {
        failures.push(`${where}  ${result.label}: not found (${result.selector})`);
      } else if (result.found !== result.expect) {
        failures.push(
          `${where}  ${result.label}: ${result.found} cards, expected ${result.expect}`,
        );
      } else if (result.spread > opts.tolerance) {
        failures.push(
          `${where}  ${result.label}: ${result.spread}px apart  ${JSON.stringify(result.heights)}`,
        );
      }
    }
    await context.close();
  }
}

await browser.close();

console.log(
  `\n${checked} card sets measured over ${opts.widths.length} widths × ${opts.langs.length} locales` +
    ` — ${failures.length} uneven (tolerance ${opts.tolerance}px)\n`,
);
if (failures.length) {
  console.log('Uneven:');
  for (const f of failures) console.log('  ' + f);
  console.log('');
}
process.exit(failures.length ? 1 : 0);
