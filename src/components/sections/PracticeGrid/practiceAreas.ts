import type { ComponentType } from 'react';
import {
  CorporateIcon,
  CommercialIcon,
  MergersIcon,
  StartupFundingIcon,
  CryptoIcon,
  PrivacyIcon,
  RealEstateIcon,
  MaritimeIcon,
  DisputesIcon,
  FamilyIcon,
} from '@/assets/illustrations';
import {
  CorporateBg,
  CommercialBg,
  MergersBg,
  StartupBg,
  CryptoBg,
  PrivacyBg,
  RealEstateBg,
  MaritimeBg,
  DisputesBg,
  FamilyBg,
} from '@/assets/domainBackgrounds';

/** The `practice<Key>*` translation-key fragment for one domain. */
export type PracticeKey =
  | 'Corporate'
  | 'Commercial'
  | 'Mergers'
  | 'Startup'
  | 'Crypto'
  | 'Privacy'
  | 'RealEstate'
  | 'Maritime'
  | 'Disputes'
  | 'Family';

/** The URL fragment for one domain — kebab-case, never derived from `key`. */
export type PracticeSlug =
  | 'corporate'
  | 'commercial'
  | 'mergers-acquisitions'
  | 'startup'
  | 'crypto'
  | 'privacy'
  | 'real-estate'
  | 'maritime'
  | 'disputes'
  | 'family';

export interface PracticeArea {
  /**
   * Names the translation keys: `practice${key}Title`, `…Desc`, `…Detail`,
   * `…Service1..5`. Card and detail page read the same keys, so the two can
   * never disagree about a title and an admin editing either edits both.
   */
  key: PracticeKey;
  /**
   * The route parameter. Kept as its own field rather than lower-casing `key`
   * at call time, because `RealEstate` lower-cases to `realestate` — the slug
   * has a hyphen the key does not.
   *
   * That used to read as a warning about some future fifth domain. Ten domains
   * in, a derived slug fails two different ways: `RealEstate` needs the hyphen
   * put back, and `Mergers` carries the slug `mergers-acquisitions` — the URL
   * names both halves of the practice, while the key names it in the one word
   * the `practice<Key>*` fragments stay readable with.
   */
  slug: PracticeSlug;
  icon: ComponentType<{ className?: string }>;
  bg: ComponentType<{ className?: string }>;
  /** Roman numeral shown on the card and the detail page. */
  num: string;
}

/**
 * The client's own order, not alphabetical and not by prominence: the numerals
 * are visible on every card, so reordering this array renumbers the site.
 */
export const practiceAreas: PracticeArea[] = [
  { key: 'Corporate', slug: 'corporate', icon: CorporateIcon, bg: CorporateBg, num: 'I' },
  { key: 'Commercial', slug: 'commercial', icon: CommercialIcon, bg: CommercialBg, num: 'II' },
  {
    key: 'Mergers',
    slug: 'mergers-acquisitions',
    icon: MergersIcon,
    bg: MergersBg,
    num: 'III',
  },
  { key: 'Startup', slug: 'startup', icon: StartupFundingIcon, bg: StartupBg, num: 'IV' },
  { key: 'Crypto', slug: 'crypto', icon: CryptoIcon, bg: CryptoBg, num: 'V' },
  { key: 'Privacy', slug: 'privacy', icon: PrivacyIcon, bg: PrivacyBg, num: 'VI' },
  { key: 'RealEstate', slug: 'real-estate', icon: RealEstateIcon, bg: RealEstateBg, num: 'VII' },
  { key: 'Maritime', slug: 'maritime', icon: MaritimeIcon, bg: MaritimeBg, num: 'VIII' },
  { key: 'Disputes', slug: 'disputes', icon: DisputesIcon, bg: DisputesBg, num: 'IX' },
  { key: 'Family', slug: 'family', icon: FamilyIcon, bg: FamilyBg, num: 'X' },
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
 * page of missing copy. The comparison is on the whole remainder rather than a
 * prefix, which is also what makes `#practice/mergers` a miss instead of a
 * truncated `mergers-acquisitions`.
 */
export function practiceFromRoute(route: string): PracticeArea | null {
  if (!route.startsWith(PRACTICE_ROUTE_PREFIX)) return null;
  const slug = route.slice(PRACTICE_ROUTE_PREFIX.length);
  return practiceAreas.find((area) => area.slug === slug) ?? null;
}
