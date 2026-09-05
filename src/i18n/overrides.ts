/**
 * Admin-authored copy overrides, layered on top of the static locale files.
 *
 * The static bundles in ./locales stay the source of truth and the fallback:
 * only keys an admin has actually edited live here, and a failed or slow fetch
 * simply means the shipped copy renders. That is deliberate — the site must
 * never depend on the database to display its own text.
 *
 * This is an external store rather than React state because `t` is consumed
 * everywhere and a row can arrive long after mount. I18nProvider subscribes via
 * useSyncExternalStore, so a save re-renders every consumer without threading
 * the value through props.
 */

type Locale = string;
type Key = string;

const overrides = new Map<Locale, Map<Key, string>>();
const listeners = new Set<() => void>();

/** Bumped on every mutation; the snapshot must be a primitive so React can
 *  compare it cheaply and avoid the infinite-loop trap of returning a new
 *  object from getSnapshot. */
let version = 0;

function emit(): void {
  version += 1;
  for (const listener of listeners) listener();
}

export function subscribeOverrides(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getOverridesVersion(): number {
  return version;
}

/** Server/hydration snapshot: prerendered HTML never carries overrides. */
export function getServerOverridesVersion(): number {
  return 0;
}

export function getOverride(locale: Locale, key: Key): string | undefined {
  return overrides.get(locale)?.get(key);
}

export interface OverrideRow {
  key: string;
  locale: string;
  value: string;
}

export function applyOverrideRows(rows: readonly OverrideRow[]): void {
  let changed = false;
  for (const row of rows) {
    if (typeof row?.key !== 'string' || typeof row?.locale !== 'string') continue;
    if (typeof row?.value !== 'string') continue;

    let bucket = overrides.get(row.locale);
    if (!bucket) {
      bucket = new Map();
      overrides.set(row.locale, bucket);
    }
    if (bucket.get(row.key) !== row.value) {
      bucket.set(row.key, row.value);
      changed = true;
    }
  }
  if (changed) emit();
}

export function applyOverride(locale: Locale, key: Key, value: string): void {
  applyOverrideRows([{ locale, key, value }]);
}

/** Test seam: drop every override so one test cannot leak into the next. */
export function resetOverrides(): void {
  overrides.clear();
  emit();
}
