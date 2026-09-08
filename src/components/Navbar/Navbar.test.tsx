import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Navbar } from './Navbar';

/**
 * Two nav links may legitimately point at the same place.
 *
 * This is not a hypothetical: HomePage's footer column lists four practice
 * areas that all link to `#practice`, and the design-system showcase renders a
 * Navbar whose four placeholder links are all `href="#"`. Navbar used to key
 * its `<li>`s on `link.href`, so both of those produced React's "two children
 * with the same key" error — twice over, since the component renders the same
 * list again in its mobile panel.
 *
 * React does not throw on a duplicate key, it logs and carries on with
 * undefined reconciliation behaviour, so the assertion has to watch the console.
 */
describe('Navbar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const sameHref = [
    { label: 'About', href: '#' },
    { label: 'Practice Areas', href: '#' },
    { label: 'Attorneys', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  it('renders links that share an href without a duplicate-key warning', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<Navbar logo={<span>VKM</span>} links={sameHref} />);

    const keyWarnings = consoleError.mock.calls.filter(([first]) =>
      typeof first === 'string' && first.includes('same key'),
    );
    expect(keyWarnings, `React logged: ${JSON.stringify(keyWarnings)}`).toHaveLength(0);
  });

  it('renders every link that shares an href, in both the bar and the mobile panel', () => {
    render(<Navbar logo={<span>VKM</span>} links={sameHref} />);

    // Each label appears twice — once in the desktop list, once in the mobile
    // panel, which is always in the DOM and hidden with CSS.
    for (const { label } of sameHref) {
      expect(screen.getAllByRole('link', { name: label })).toHaveLength(2);
    }
  });

  it('still renders distinct hrefs correctly', () => {
    render(
      <Navbar
        logo={<span>VKM</span>}
        links={[
          { label: 'Team', href: '#team' },
          { label: 'Contact', href: '#contact' },
        ]}
      />,
    );

    const [team] = screen.getAllByRole('link', { name: 'Team' });
    expect(team).toHaveAttribute('href', '#team');
  });

  it('keeps the logo out of the link list', () => {
    render(<Navbar logo={<span>VKM</span>} links={sameHref} />);

    const lists = screen.getAllByRole('list');
    for (const list of lists) {
      expect(within(list).queryByText('VKM')).toBeNull();
    }
  });
});
