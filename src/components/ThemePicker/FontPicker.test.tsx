import { afterEach, describe, expect, it } from 'vitest';
import { ThemeProvider } from '@/lib/theme';
import { FONT_STORAGE_KEY } from '@/lib/theme/context';
import { renderWithProviders, screen } from '@/test/utils';
import { FontPicker } from './FontPicker';

/**
 * `renderWithProviders` deliberately does not include `ThemeProvider` (most
 * components under test never touch the theme), so it is wrapped here by
 * hand — same shape as LookPicker.test.tsx.
 */
function renderFont() {
  return renderWithProviders(
    <ThemeProvider>
      <FontPicker />
    </ThemeProvider>,
  );
}

// ThemeProvider mirrors its state onto <html>, which outlives a single test's
// render tree — clear it, or one test's font pin leaks into the next.
afterEach(() => {
  delete document.documentElement.dataset.font;
  delete document.documentElement.dataset.mode;
});

describe('FontPicker', () => {
  it('has exactly one checked radio, defaulting to Follow the look', () => {
    renderFont();
    const radios = screen.getAllByRole('radio');
    // "Follow the look" plus the three registry choices.
    expect(radios).toHaveLength(4);
    const checked = radios.filter((r) => r.getAttribute('aria-checked') === 'true');
    expect(checked).toHaveLength(1);
    expect(checked[0]).toHaveAccessibleName(/follow the look/i);
  });

  it('pins a typeface and stamps data-font when a row is clicked', async () => {
    const { user } = renderFont();
    await user.click(screen.getByRole('radio', { name: /gfs didot/i }));

    expect(document.documentElement.dataset.font).toBe('gfsDidot');
    expect(window.localStorage.getItem(FONT_STORAGE_KEY)).toBe('gfsDidot');

    const radios = screen.getAllByRole('radio');
    const checked = radios.filter((r) => r.getAttribute('aria-checked') === 'true');
    expect(checked).toHaveLength(1);
    expect(checked[0]).toHaveAccessibleName(/gfs didot/i);
  });

  it('removes the attribute and the storage key when Follow the look is re-selected', async () => {
    const { user } = renderFont();

    // Anchored: "Follow the look" also mentions Jura in its own hint text, so
    // an unanchored /jura/i would match two rows. The label and hint run
    // together with no separator in the accessible name (same as
    // ModeOptions/StatueOptions), so this is "^jura" rather than a whole-word
    // match.
    await user.click(screen.getByRole('radio', { name: /^jura/i }));
    expect(document.documentElement.dataset.font).toBe('jura');

    await user.click(screen.getByRole('radio', { name: /follow the look/i }));

    expect(document.documentElement.dataset.font).toBeUndefined();
    expect(window.localStorage.getItem(FONT_STORAGE_KEY)).toBeNull();
  });

  it('moves the selection through the list with arrow keys', async () => {
    const { user } = renderFont();
    const auto = screen.getByRole('radio', { name: /follow the look/i });

    auto.focus();
    await user.keyboard('{ArrowDown}');

    const radios = screen.getAllByRole('radio');
    // The second row in registry order is "Jura".
    expect(radios[1]).toHaveFocus();
    expect(radios[1]).toHaveAccessibleName(/jura/i);
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');

    // Wraps back around to "Follow the look" after the last row.
    await user.keyboard('{ArrowUp}');
    expect(auto).toHaveFocus();
    expect(auto).toHaveAttribute('aria-checked', 'true');
  });
});
