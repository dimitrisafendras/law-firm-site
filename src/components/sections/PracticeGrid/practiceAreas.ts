import type { ComponentType } from 'react';
import {
  RealEstateIcon,
  StartupFundingIcon,
  MaritimeIcon,
  CryptoIcon,
} from '@/assets/illustrations';
import { RealEstateBg, StartupBg, MaritimeBg, CryptoBg } from '@/assets/domainBackgrounds';

/** The `practice<Key>*` translation-key fragment for one domain. */
export type PracticeKey = 'RealEstate' | 'Startup' | 'Maritime' | 'Crypto';

/** The URL fragment for one domain — kebab-case, never derived from `key`. */
export type PracticeSlug = 'real-estate' | 'startup' | 'maritime' | 'crypto';

export interface PracticeArea {
  /**
   * Names the translation keys: `practice${key}Title`, `…Desc`, `…Detail`,
   * `…Service1..4`. Card and detail page read the same keys, so the two can
   * never disagree about a title and an admin editing either edits both.
   */
  key: PracticeKey;
  /**
   * The route parameter. Kept as its own field rather than lower-casing `key`
   * at call time, because `RealEstate` lower-cases to `realestate` — the slug
   * has a hyphen the key does not, and a derived slug would silently drift the
   * moment a fifth domain has a two-word name.
   */
  slug: PracticeSlug;
  icon: ComponentType<{ className?: string }>;
  bg: ComponentType<{ className?: string }>;
  /** Roman numeral shown on the card and the detail page. */
  num: string;
}

export const practiceAreas: PracticeArea[] = [
  { key: 'RealEstate', slug: 'real-estate', icon: RealEstateIcon, bg: RealEstateBg, num: 'I' },
  { key: 'Startup', slug: 'startup', icon: StartupFundingIcon, bg: StartupBg, num: 'II' },
  { key: 'Maritime', slug: 'maritime', icon: MaritimeIcon, bg: MaritimeBg, num: 'III' },
  { key: 'Crypto', slug: 'crypto', icon: CryptoIcon, bg: CryptoBg, num: 'IV' },
];

/**
 * The detail-page route prefix.
 *
 * `practice/real-estate` rather than `practice-real-estate` or
 * `practice?area=real-estate`: App's `routeOf()` splits the hash on `[?&]` to
 * shed OAuth redirect payloads, so a query-style parameter would be thrown away
 * with them. A slash survives that split untouched.
 *
 * The slash also keeps the slug visibly a parameter rather than part of the
 * page name, which matters more here than it did for partners: the home page's
 * practice section is the plain anchor `#practice`, and `practice/…` cannot
 * collide with it — `routeOf('#practice')` is `practice`, which does not start
 * with `practice/` and so falls through to the home page and its anchor.
 */
export const PRACTICE_ROUTE_PREFIX = 'practice/';

/** The `href` a link to a practice area's detail page should carry. */
export function practiceHref(slug: PracticeSlug): string {
  return `#${PRACTICE_ROUTE_PREFIX}${slug}`;
}

/**
 * Resolve a route name (already stripped by `routeOf()`) to a practice area.
 *
 * Returns `null` for anything that is not a practice route and for a slug with
 * no area behind it — `#practice/tax`, `#practice/`, `#practice/real-estate/x`
 * — so the router can fall through to the home page instead of rendering a
 * page of missing copy.
 */
export function practiceFromRoute(route: string): PracticeArea | null {
  if (!route.startsWith(PRACTICE_ROUTE_PREFIX)) return null;
  const slug = route.slice(PRACTICE_ROUTE_PREFIX.length);
  return practiceAreas.find((area) => area.slug === slug) ?? null;
}
