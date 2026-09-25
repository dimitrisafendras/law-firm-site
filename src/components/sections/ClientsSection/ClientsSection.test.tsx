import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ClientsSection } from './ClientsSection';
import { clients } from './clients';
import en from '@/i18n/locales/en';
import { interpolate } from '@/i18n';

/**
 * The admin hide/show path, which shipped unexercised.
 *
 * The feature commit says so outright: "The admin path could not be exercised
 * here — I have no account to sign in with." Everything in the second describe
 * had therefore never run against the real component. Signing in is also not
 * something a test should need: `canEdit` and the Supabase client are the only
 * two inputs deciding this behaviour, so both are mocked and the component and
 * its hook then run for real.
 *
 * The invariant these protect is the one the migration comment, the hook doc
 * and the commit message each state independently: ABSENCE OF A ROW MEANS
 * VISIBLE. Every failure mode — no table, RLS refusing, network down, fetch
 * still in flight — has to land on "show what the code lists", because a blank
 * wall looks broken and explains nothing.
 */

const canEdit = vi.hoisted(() => ({ value: false }));

/** What the `client_visibility` select resolves to. Set per test. */
const visibilityRead = vi.hoisted(() => ({
  data: [] as { client_id: string; hidden: boolean }[] | null,
  error: null as { message: string } | null,
}));

/** What the upsert resolves to, so the write-failure path is reachable. */
const visibilityWrite = vi.hoisted(() => ({ error: null as { message: string } | null }));

const upsert = vi.hoisted(() => vi.fn());

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      // `.select().returns()` is the read. `.returns()` is a type-only cast in
      // supabase-js, so it hands back the same thenable.
      select: () => ({
        returns: () => Promise.resolve({ data: visibilityRead.data, error: visibilityRead.error }),
      }),
      upsert: (...args: unknown[]) => {
        upsert(...args);
        return Promise.resolve({ error: visibilityWrite.error });
      },
    }),
  },
}));

vi.mock('@/lib/edit-mode', () => ({
  useEditMode: () => ({ canEdit: canEdit.value }),
}));

// SectionHeader renders EditableText, which would otherwise reach for the
// content editor and Supabase. Irrelevant to the wall.
vi.mock('@/lib/content/useContentEditor', () => ({
  useContentEditor: () => ({ saveOverride: vi.fn(async () => ({ error: null })), saving: false }),
}));

vi.mock('@/i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/i18n')>();
  return {
    ...actual,
    useTranslation: () => ({
      lang: 'en' as const,
      t: (key: string, params?: Record<string, string | number>) =>
        actual.interpolate((en as Record<string, string>)[key] ?? key, params),
    }),
  };
});

const DEVELOR = en.clientDevelor;
const hideLabel = interpolate(en.clientHideLabel, { name: DEVELOR });
const showLabel = interpolate(en.clientShowLabel, { name: DEVELOR });

/**
 * Everything is scoped to `.clients-wall` rather than the section, because the
 * section header is three EditableTexts and each of those renders as a BUTTON
 * once an admin is editing. Counting buttons across the whole section measures
 * the header too and reports 11 toggles for 8 clients.
 */
function wall(): HTMLElement {
  const el = document.querySelector('.clients-wall');
  if (!(el instanceof HTMLElement)) throw new Error('no .clients-wall rendered');
  return el;
}

/** The wall paints first and the visibility read lands after. */
async function renderWall() {
  const view = render(<ClientsSection />);
  await waitFor(() =>
    expect(within(wall()).getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(0),
  );
  return view;
}

/**
 * Card names with the link's visually-hidden "(opens in a new tab)" stripped.
 * Without this every name assertion is vacuous: signed out the heading reads
 * "Develor Greece (opens in a new tab)", so a plain `toContain(DEVELOR)` fails
 * and — worse — a `not.toContain(DEVELOR)` passes whether the card is there or
 * not.
 */
function cardNames(): string[] {
  return within(wall())
    .getAllByRole('heading', { level: 3 })
    .map((h) =>
      (h.textContent ?? '').replace(en.clientsOpensInNewTab, '').replace(/\s+/g, ' ').trim(),
    );
}

beforeEach(() => {
  canEdit.value = false;
  visibilityRead.data = [];
  visibilityRead.error = null;
  visibilityWrite.error = null;
  upsert.mockClear();
});

describe('clients wall, signed out', () => {
  it('shows every client the code lists when nothing is hidden', async () => {
    await renderWall();

    expect(cardNames()).toHaveLength(clients.length);
    expect(within(wall()).getAllByRole('link')).toHaveLength(clients.length);
    expect(within(wall()).queryAllByRole('button')).toHaveLength(0);
  });

  it('leaves out a client an admin has hidden', async () => {
    visibilityRead.data = [{ client_id: 'develor', hidden: true }];
    await renderWall();

    await waitFor(() => expect(cardNames()).toHaveLength(clients.length - 1));
    expect(cardNames()).not.toContain(DEVELOR);
  });

  it('keeps a client whose row says hidden: false', async () => {
    visibilityRead.data = [{ client_id: 'develor', hidden: false }];
    await renderWall();

    expect(cardNames()).toContain(DEVELOR);
  });

  /*
   * The whole point of the design. A read failure is the migration not being
   * applied, RLS refusing, or the network being down — and every one of those
   * has to show the wall rather than blank it.
   */
  it('shows the whole wall when the visibility read fails', async () => {
    visibilityRead.error = { message: 'relation client_visibility does not exist' };
    await renderWall();

    await waitFor(() => expect(cardNames()).toHaveLength(clients.length));
  });

  it('shows the whole wall when the read returns nothing at all', async () => {
    visibilityRead.data = null;
    await renderWall();

    expect(cardNames()).toHaveLength(clients.length);
  });
});

describe('clients wall, admin editing', () => {
  beforeEach(() => {
    canEdit.value = true;
  });

  it('keeps a hidden client on the wall, marked, so it can be put back', async () => {
    visibilityRead.data = [{ client_id: 'develor', hidden: true }];
    await renderWall();

    await waitFor(() =>
      expect(screen.getByRole('button', { name: showLabel })).toBeInTheDocument(),
    );
    expect(cardNames()).toHaveLength(clients.length);
  });

  it('names the client in each toggle, not just "Hide"', async () => {
    await renderWall();

    const toggles = within(wall()).getAllByRole('button');
    expect(toggles).toHaveLength(clients.length);
    expect(toggles[0]).toHaveAccessibleName(hideLabel);
    // Eight buttons reading the same word would be unusable by voice or from a
    // screen reader's element list.
    expect(new Set(toggles.map((b) => b.getAttribute('aria-label'))).size).toBe(clients.length);
  });

  it('drops the link while editing, so no control is nested in one', async () => {
    await renderWall();

    expect(within(wall()).queryAllByRole('link')).toHaveLength(0);
  });

  it('hides a client on click and answers immediately, with no refetch', async () => {
    const user = userEvent.setup();
    await renderWall();

    const hide = screen.getByRole('button', { name: hideLabel });
    expect(hide).toHaveAttribute('aria-pressed', 'false');

    await user.click(hide);

    expect(upsert).toHaveBeenCalledWith(
      { client_id: 'develor', hidden: true },
      { onConflict: 'client_id' },
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: showLabel })).toHaveAttribute(
        'aria-pressed',
        'true',
      ),
    );
  });

  it('puts a hidden client back', async () => {
    visibilityRead.data = [{ client_id: 'develor', hidden: true }];
    const user = userEvent.setup();
    await renderWall();

    await user.click(await screen.findByRole('button', { name: showLabel }));

    expect(upsert).toHaveBeenCalledWith(
      { client_id: 'develor', hidden: false },
      { onConflict: 'client_id' },
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: hideLabel })).toHaveAttribute(
        'aria-pressed',
        'false',
      ),
    );
  });

  /*
   * A write that failed must not leave the wall claiming it succeeded — the
   * admin is waiting on an answer and a silent flip reads as yes.
   */
  it('leaves the toggle where it was when the write fails', async () => {
    visibilityWrite.error = { message: 'new row violates row-level security policy' };
    const user = userEvent.setup();
    await renderWall();

    await user.click(screen.getByRole('button', { name: hideLabel }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: hideLabel })).toHaveAttribute(
        'aria-pressed',
        'false',
      ),
    );
  });

  /*
   * The other half of the same failure. The hook returns an error for the
   * caller to show, and the section used to drop it with `void`, so a write
   * that never landed produced no movement and no message. With the migration
   * unapplied — which is the live state: GET /rest/v1/client_visibility 404s —
   * that is EVERY toggle, and silence is why the feature reads as broken
   * rather than as unconfigured.
   */
  it('tells the admin when the write did not land', async () => {
    visibilityWrite.error = { message: 'relation "public.client_visibility" does not exist' };
    const user = userEvent.setup();
    await renderWall();

    expect(within(wall()).queryByRole('alert')).toBeNull();

    await user.click(screen.getByRole('button', { name: hideLabel }));

    const alert = await within(wall()).findByRole('alert');
    expect(alert).toHaveTextContent(en.editError);
  });

  it('marks only the card that failed', async () => {
    visibilityWrite.error = { message: 'boom' };
    const user = userEvent.setup();
    await renderWall();

    await user.click(screen.getByRole('button', { name: hideLabel }));

    await within(wall()).findByRole('alert');
    expect(within(wall()).getAllByRole('alert')).toHaveLength(1);
  });

  it('clears the message when a retry succeeds', async () => {
    visibilityWrite.error = { message: 'boom' };
    const user = userEvent.setup();
    await renderWall();

    await user.click(screen.getByRole('button', { name: hideLabel }));
    await within(wall()).findByRole('alert');

    visibilityWrite.error = null;
    await user.click(screen.getByRole('button', { name: hideLabel }));

    await waitFor(() => expect(within(wall()).queryByRole('alert')).toBeNull());
    expect(screen.getByRole('button', { name: showLabel })).toHaveAttribute('aria-pressed', 'true');
  });

  it('says nothing when the write succeeds', async () => {
    const user = userEvent.setup();
    await renderWall();

    await user.click(screen.getByRole('button', { name: hideLabel }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: showLabel })).toHaveAttribute('aria-pressed', 'true'),
    );
    expect(within(wall()).queryByRole('alert')).toBeNull();
  });
});
