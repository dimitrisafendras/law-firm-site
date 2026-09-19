import { CLIENT_LOGOS, type ClientLogo } from './logos.generated';

export interface Client {
  /** Matches the logo id in logos.generated.ts. */
  id: string;
  logo: ClientLogo;
  /** The client's own site. Opens in a new tab. */
  href: string;
  /**
   * Translation key for the client's name.
   *
   * The name is the logo's accessible text, not a caption — the wall shows
   * marks, and a mark that a screen reader announces as "image" is a link with
   * no destination anyone can read. Several of these are unreadable as pictures
   * too: PSI's mark is an abstract monogram with no wordmark in it, so the name
   * is the only thing identifying the link for ANY reader who does not already
   * know the brand.
   */
  nameKey: string;
}

/**
 * The roster, in the order it reads on the wall.
 *
 * Deliberately not alphabetical and not by logo width: the order alternates
 * wide wordmarks with compact marks so no row is all one shape, which is the
 * only arrangement decision a logo wall really has.
 */
export const clients: Client[] = [
  { id: 'develor', logo: CLIENT_LOGOS.develor, href: 'https://develor.gr/', nameKey: 'clientDevelor' },
  { id: 'karras', logo: CLIENT_LOGOS.karras, href: 'https://www.karrasgranderesort.com/el/', nameKey: 'clientKarras' },
  { id: 'starboard', logo: CLIENT_LOGOS.starboard, href: 'https://starboard-digital.com/', nameKey: 'clientStarboard' },
  { id: 'goat', logo: CLIENT_LOGOS.goat, href: 'https://goatcoffeeroasters.gr/', nameKey: 'clientGoat' },
  { id: 'evivios', logo: CLIENT_LOGOS.evivios, href: 'https://www.eviviosmed.gr/', nameKey: 'clientEvivios' },
  { id: 'cityskal', logo: CLIENT_LOGOS.cityskal, href: 'https://skalosies-athina.gr/', nameKey: 'clientCityskal' },
  { id: 'padel', logo: CLIENT_LOGOS.padel, href: 'https://ellinikopadelclub.gr/', nameKey: 'clientPadel' },
  { id: 'psi', logo: CLIENT_LOGOS.psi, href: 'https://www.psi-c.gr/el', nameKey: 'clientPsi' },
];
