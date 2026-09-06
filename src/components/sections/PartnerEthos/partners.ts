import partnerMaleImg from '@/assets/images/partner-male.jpg';
import partnerFemaleImg from '@/assets/images/partner-female.jpg';
import partnerMaleAvif from '@/assets/images/partner-male.avif';
import partnerFemaleAvif from '@/assets/images/partner-female.avif';

export interface Partner {
  /** 1-based, matching the `attorneyN*` translation keys. */
  n: 1 | 2 | 3;
  avif: string;
  fallback: string;
}

/*
 * PLACEHOLDER: no third headshot exists yet, so partner 3 reuses partner 1's
 * portrait. Two slots therefore point at the same file — when the real
 * photography arrives, both `avif`/`fallback` pairs below must be updated, not
 * just one.
 */
export const partners: Partner[] = [
  { n: 1, avif: partnerMaleAvif, fallback: partnerMaleImg },
  { n: 2, avif: partnerFemaleAvif, fallback: partnerFemaleImg },
  { n: 3, avif: partnerMaleAvif, fallback: partnerMaleImg },
];

/**
 * The detail-page route prefix.
 *
 * `partner/1` rather than `partner-1` or `partner?id=1`: App's `routeOf()`
 * splits the hash on `[?&]` to shed OAuth redirect payloads, so a query-style
 * id would be thrown away with them. A slash survives that split untouched,
 * and it keeps the id visibly a parameter rather than part of the page name —
 * so a future page genuinely called `partner-something` cannot collide with it.
 */
export const PARTNER_ROUTE_PREFIX = 'partner/';

/** The `href` a link to a partner's detail page should carry. */
export function partnerHref(n: Partner['n']): string {
  return `#${PARTNER_ROUTE_PREFIX}${n}`;
}

/**
 * Resolve a route name (already stripped by `routeOf()`) to a partner.
 *
 * Returns `null` for anything that is not a partner route and for an id with
 * no partner behind it — `#partner/9`, `#partner/`, `#partner/1x` — so the
 * router can fall through to the home page instead of rendering a page with
 * missing copy.
 */
export function partnerFromRoute(route: string): Partner | null {
  if (!route.startsWith(PARTNER_ROUTE_PREFIX)) return null;
  const id = route.slice(PARTNER_ROUTE_PREFIX.length);
  return partners.find((partner) => String(partner.n) === id) ?? null;
}
