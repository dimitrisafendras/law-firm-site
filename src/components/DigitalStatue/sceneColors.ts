/**
 * The statue scene's colours, read from the active palette.
 *
 * ── Why this exists ──────────────────────────────────────────────────────────
 *
 * Everything in this scene is painted into a `<canvas>`, and a canvas cannot
 * take `var(--accent)` — `fillStyle` wants a concrete colour string. So these
 * five effects used to carry `rgba(188,232,255, …)` and `rgba(137,207,240, …)`
 * as literals: the dark palette's accent and secondary, hand-copied into three
 * files. With ten palettes on the site that stops being a style violation and
 * starts being a bug — the rain would still fall baby-blue over Papyrus.
 *
 * The custom properties are resolved once per scene start (and again whenever
 * the palette changes, because DigitalStatue's effect re-runs on it) and handed
 * to the workers as plain "r, g, b" triples. Workers get triples rather than
 * variable names for the obvious reason: a worker has no document to read them
 * from.
 */

/** An "r, g, b" triple, ready to interpolate into an `rgba(…)` string. */
export type RgbTriple = string;

export interface SceneColors {
  /** The brand's brightest step. Rain heads, star haloes, the hot flame core. */
  accent: RgbTriple;
  /** The step below it. Rain trails, and the flame's body. */
  secondary: RgbTriple;
  /** Accent lifted halfway to white — the specular pass on stars and flame. */
  accentBright: RgbTriple;
}

/*
 * Resolution goes through the browser rather than a hex parser.
 *
 * A palette token is free to be `#BCE8FF`, `rgb(…)`, `rgba(…)` or a named
 * colour, and `getPropertyValue` hands back whatever was authored — it does not
 * normalise custom properties. Setting the value on a probe element and reading
 * `color` back does normalise it, using the same parser the rest of the page
 * uses, so nothing here has to know which notations a token might be written in.
 */
function resolveRgb(value: string, fallback: RgbTriple): { triple: RgbTriple; rgb: [number, number, number] } {
  const parseTriple = (t: RgbTriple): [number, number, number] => {
    const n = t.split(',').map((p) => Number(p.trim()));
    return [n[0] ?? 0, n[1] ?? 0, n[2] ?? 0];
  };

  if (typeof document === 'undefined' || !value) {
    return { triple: fallback, rgb: parseTriple(fallback) };
  }

  const probe = document.createElement('span');
  probe.style.display = 'none';
  probe.style.color = value;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();

  const match = computed.match(/(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)/);
  if (!match) return { triple: fallback, rgb: parseTriple(fallback) };

  const rgb: [number, number, number] = [
    Math.round(Number(match[1])),
    Math.round(Number(match[2])),
    Math.round(Number(match[3])),
  ];
  return { triple: rgb.join(','), rgb };
}

/* The dark palette's own values, used when there is no document to read (the
   prerender pass) or when a token resolves to something unparseable. They are
   the default palette's, so the fallback is never a colour the site does not
   otherwise wear. */
const FALLBACK_ACCENT: RgbTriple = '188,232,255';
const FALLBACK_SECONDARY: RgbTriple = '137,207,240';

export function readSceneColors(): SceneColors {
  const root = typeof document === 'undefined' ? null : document.documentElement;
  const styles = root ? getComputedStyle(root) : null;

  const accent = resolveRgb(styles?.getPropertyValue('--accent').trim() ?? '', FALLBACK_ACCENT);
  const secondary = resolveRgb(
    styles?.getPropertyValue('--secondary').trim() ?? '',
    FALLBACK_SECONDARY,
  );

  // Halfway to white. On a light palette the accent is already pale and this
  // step nearly disappears, which is correct — a specular highlight over a
  // bright ground should be subtle rather than absent.
  const bright = accent.rgb.map((c) => Math.round(c + (255 - c) * 0.5)).join(',');

  return { accent: accent.triple, secondary: secondary.triple, accentBright: bright };
}
