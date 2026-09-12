import { afterEach, describe, expect, it } from 'vitest';
import { ThemeProvider } from '@/lib/theme';
import { MODE_STORAGE_KEY, STATUE_STORAGE_KEY } from '@/lib/theme/context';
import { renderWithProviders, screen, within } from '@/test/utils';
import { ModeOptions } from './ModeOptions';
import { StatueOptions } from './StatueOptions';

/**
 * `renderWithProviders` deliberately does not include `ThemeProvider` (most
 * components under test never touch the theme), so it is wrapped here by hand.
 */
function renderMode() {
  return renderWithProviders(
    <ThemeProvider>
      <ModeOptions />
    </ThemeProvider>,
  );
}

function renderStatue() {
  return renderWithProviders(
    <ThemeProvider>
      <StatueOptions />
    </ThemeProvider>,
  );
}

// ThemeProvider mirrors its state onto <html>, which outlives a single test's
// render tree — clear it, or one test's mode/statue leaks into the next.
afterEach(() => {
  delete document.documentElement.dataset.mode;
  delete document.documentElement.dataset.statue;
});

describe('ModeOptions', () => {
  it('has exactly one checked radio, defaulting to digital', () => {
    renderMode();
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    const checked = radios.filter((r) => r.getAttribute('aria-checked') === 'true');
    expect(checked).toHaveLength(1);
    expect(checked[0]).toHaveAccessibleName(/digital/i);
  });

  it('sets data-mode and persists the choice when Classic is clicked', async () => {
    const { user } = renderMode();
    await user.click(screen.getByRole('radio', { name: /classic/i }));

    expect(document.documentElement.dataset.mode).toBe('classic');
    expect(window.localStorage.getItem(MODE_STORAGE_KEY)).toBe('classic');

    const radios = screen.getAllByRole('radio');
    const checked = radios.filter((r) => r.getAttribute('aria-checked') === 'true');
    expect(checked).toHaveLength(1);
    expect(checked[0]).toHaveAccessibleName(/classic/i);
  });

  it('moves the selection with arrow keys', async () => {
    const { user } = renderMode();
    const digital = screen.getByRole('radio', { name: /digital/i });
    const classic = screen.getByRole('radio', { name: /classic/i });

    digital.focus();
    await user.keyboard('{ArrowDown}');

    expect(classic).toHaveFocus();
    expect(classic).toHaveAttribute('aria-checked', 'true');
    expect(digital).toHaveAttribute('aria-checked', 'false');
    expect(document.documentElement.dataset.mode).toBe('classic');

    // Wraps back around to the first row.
    await user.keyboard('{ArrowDown}');
    expect(digital).toHaveFocus();
    expect(digital).toHaveAttribute('aria-checked', 'true');
  });
});

describe('StatueOptions', () => {
  it('has exactly one checked radio, defaulting to Follow the theme', () => {
    renderStatue();
    const radios = screen.getAllByRole('radio');
    // "Follow the theme" plus the five registry artworks.
    expect(radios).toHaveLength(6);
    const checked = radios.filter((r) => r.getAttribute('aria-checked') === 'true');
    expect(checked).toHaveLength(1);
    expect(checked[0]).toHaveAccessibleName(/follow the theme/i);
  });

  it('pins a statue and stamps data-statue when a row is clicked', async () => {
    const { user } = renderStatue();
    await user.click(screen.getByRole('radio', { name: /monochrome/i }));

    expect(document.documentElement.dataset.statue).toBe('mono');
    expect(window.localStorage.getItem(STATUE_STORAGE_KEY)).toBe('mono');

    const radios = screen.getAllByRole('radio');
    const checked = radios.filter((r) => r.getAttribute('aria-checked') === 'true');
    expect(checked).toHaveLength(1);
    expect(checked[0]).toHaveAccessibleName(/monochrome/i);
  });

  it('removes the attribute and the storage key when Follow the theme is re-selected', async () => {
    const { user } = renderStatue();

    await user.click(screen.getByRole('radio', { name: /monochrome/i }));
    expect(document.documentElement.dataset.statue).toBe('mono');

    await user.click(screen.getByRole('radio', { name: /follow the theme/i }));

    expect(document.documentElement.dataset.statue).toBeUndefined();
    expect(window.localStorage.getItem(STATUE_STORAGE_KEY)).toBeNull();
  });

  it('moves the selection through the list with arrow keys', async () => {
    const { user } = renderStatue();
    const auto = screen.getByRole('radio', { name: /follow the theme/i });

    auto.focus();
    await user.keyboard('{ArrowDown}');

    const radios = screen.getAllByRole('radio');
    // The second row in registry order is "Ultramarine" — the artwork every
    // palette wears, and so the one the list leads with.
    expect(radios[1]).toHaveFocus();
    expect(radios[1]).toHaveAccessibleName(/ultramarine/i);
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');
  });
});

describe('ModeOptions and StatueOptions together', () => {
  it('keep independent selections in the same document', async () => {
    const { user } = renderWithProviders(
      <ThemeProvider>
        <div>
          <div data-testid="mode-group">
            <ModeOptions />
          </div>
          <div data-testid="statue-group">
            <StatueOptions />
          </div>
        </div>
      </ThemeProvider>,
    );

    const modeGroup = screen.getByTestId('mode-group');
    const statueGroup = screen.getByTestId('statue-group');

    await user.click(within(modeGroup).getByRole('radio', { name: /classic/i }));
    await user.click(within(statueGroup).getByRole('radio', { name: /limestone/i }));

    expect(document.documentElement.dataset.mode).toBe('classic');
    expect(document.documentElement.dataset.statue).toBe('limestone');
  });
});
