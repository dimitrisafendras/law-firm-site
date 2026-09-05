/* eslint-disable react-refresh/only-export-components -- test helpers, not a Fast Refresh boundary */
import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import type { Mock } from 'vitest';
import type { JSX, ReactElement, ReactNode } from 'react';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

import { I18nProvider } from '@/i18n/I18nProvider';
import { STORAGE_KEY as LANG_STORAGE_KEY } from '@/i18n';
import { resetOverrides } from '@/i18n/overrides';
import { AuthContext } from '@/lib/auth/useAuth';
import type { AuthState, Profile } from '@/lib/auth';
import { EditModeProvider } from '@/lib/edit-mode';

/* ------------------------------------------------------------------ *
 * Auth fixtures
 * ------------------------------------------------------------------ */

/**
 * Who is looking at the page.
 *
 * `admin` is the only role that can ever edit, and even then only once edit
 * mode is unlocked — see `editMode` in {@link RenderWithProvidersOptions}.
 */
export type AuthScenario = 'signed-out' | 'user' | 'admin';

const TEST_USER_ID = '00000000-0000-4000-8000-000000000001';
const TEST_ADMIN_ID = '00000000-0000-4000-8000-000000000002';

/** A `User` complete enough for the app, without inventing Supabase behaviour. */
export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: TEST_USER_ID,
    aud: 'authenticated',
    role: 'authenticated',
    email: 'visitor@example.com',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {},
    created_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  } as User;
}

export function makeSession(overrides: Partial<Session> = {}): Session {
  const user = overrides.user ?? makeUser();
  return {
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    token_type: 'bearer',
    expires_in: 3600,
    // Fixed and far future: never derived from the wall clock, so a test can
    // never flake on an expiry boundary.
    expires_at: 4102444800,
    user,
    ...overrides,
  } as Session;
}

export function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: TEST_USER_ID,
    email: 'visitor@example.com',
    role: 'user',
    ...overrides,
  };
}

/** The signed-in admin fixture. `role: 'admin'` is what makes `isAdmin` true. */
export function makeAdminProfile(overrides: Partial<Profile> = {}): Profile {
  return makeProfile({
    id: TEST_ADMIN_ID,
    email: 'admin@example.com',
    role: 'admin',
    ...overrides,
  });
}

/** The auth callbacks, as spies, so a test can assert what a component called. */
export interface AuthSpies {
  signInWithPassword: Mock<AuthState['signInWithPassword']>;
  signUpWithPassword: Mock<AuthState['signUpWithPassword']>;
  signInWithProvider: Mock<AuthState['signInWithProvider']>;
  signOut: Mock<AuthState['signOut']>;
}

export type MockAuthState = AuthState & AuthSpies;

/**
 * Build the value an `<AuthProvider>` would have produced, without Supabase.
 *
 * Tests for `AuthProvider` itself should NOT use this — they should render the
 * real provider over {@link createMockSupabaseClient}. This is for everything
 * downstream, which only ever consumes the context.
 */
export function makeAuthState(
  scenario: AuthScenario = 'signed-out',
  overrides: Partial<AuthState> = {},
): MockAuthState {
  const spies: AuthSpies = {
    signInWithPassword: vi.fn(async () => ({ error: null })),
    signUpWithPassword: vi.fn(async () => ({ error: null })),
    signInWithProvider: vi.fn(async () => ({ error: null })),
    signOut: vi.fn(async () => {}),
  };

  let profile: Profile | null = null;
  if (scenario === 'user') profile = makeProfile();
  if (scenario === 'admin') profile = makeAdminProfile();

  const user = profile === null ? null : makeUser({ id: profile.id, email: profile.email });
  const session = user === null ? null : makeSession({ user });

  const base: MockAuthState = {
    session,
    user,
    profile,
    isAdmin: profile?.role === 'admin',
    // Resolved by default: a component under test should be rendering its real
    // output, not a loading placeholder, unless the test asks for one.
    loading: false,
    ...spies,
  };

  // Object.assign rather than a spread: a spread of Partial<AuthState> widens
  // the spy properties back to plain functions and loses the Mock types.
  return Object.assign(base, overrides);
}

/* ------------------------------------------------------------------ *
 * Render helper
 * ------------------------------------------------------------------ */

/** localStorage key `EditModeProvider` persists the unlock preference under. */
const EDIT_MODE_STORAGE_KEY = 'law-firm-site:edit-mode';

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Who is viewing. Default `'signed-out'`. */
  auth?: AuthScenario;
  /** Patch the auth state — e.g. `{ loading: true }` or a specific profile. */
  authOverrides?: Partial<AuthState>;
  /**
   * Whether the admin has unlocked editing. Default `false`, matching
   * production. Seeded through localStorage so the REAL `EditModeProvider`
   * computes `canEdit`; a non-admin with `editMode: true` still cannot edit,
   * exactly as in the app.
   */
  editMode?: boolean;
  /** Language to render in. Default `'en'`. */
  language?: 'en' | 'el';
}

export interface RenderWithProvidersResult extends RenderResult {
  /** The auth state the tree was given, including the callback spies. */
  auth: MockAuthState;
  /** A pre-configured `userEvent` instance — use this over `fireEvent`. */
  user: UserEvent;
}

/**
 * Render a component inside the same provider stack as `src/main.tsx`, minus
 * `ContentProvider` (which is a Supabase fetch effect and a passthrough — a
 * test that cares about content overrides should render it explicitly).
 */
export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
): RenderWithProvidersResult {
  const {
    auth: scenario = 'signed-out',
    authOverrides,
    editMode = false,
    language = 'en',
    ...renderOptions
  } = options;

  const auth = makeAuthState(scenario, authOverrides);

  // Written before render: EditModeProvider reads storage in its useState
  // initialiser, so seeding it afterwards would be a render too late.
  window.localStorage.setItem(EDIT_MODE_STORAGE_KEY, editMode ? 'on' : 'off');

  // I18nProvider reads the language from localStorage via useSyncExternalStore,
  // so seed it before render rather than switching afterwards.
  window.localStorage.setItem(LANG_STORAGE_KEY, language);
  // Copy overrides are module-level state; clear them so one test's saved edit
  // cannot leak into the next.
  resetOverrides();

  function Providers({ children }: { children: ReactNode }): JSX.Element {
    return (
      <I18nProvider>
        <AuthContext.Provider value={auth}>
          <EditModeProvider>{children}</EditModeProvider>
        </AuthContext.Provider>
      </I18nProvider>
    );
  }

  const result = render(ui, { wrapper: Providers, ...renderOptions });

  return { ...result, auth, user: userEvent.setup() };
}

/** Shorthand: the case most edit-mode tests want. */
export function renderAsAdmin(
  ui: ReactElement,
  options: Omit<RenderWithProvidersOptions, 'auth'> = {},
): RenderWithProvidersResult {
  return renderWithProviders(ui, { ...options, auth: 'admin' });
}

/* ------------------------------------------------------------------ *
 * Supabase mock
 * ------------------------------------------------------------------ */

export interface MockPostgrestError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

/** Build the error shape PostgREST returns, from just a message. */
export function makePostgrestError(
  message: string,
  overrides: Partial<MockPostgrestError> = {},
): MockPostgrestError {
  return { message, details: '', hint: '', code: 'MOCK', ...overrides };
}

/** A write the app performed, captured so a test can assert on it. */
export interface RecordedWrite {
  table: string;
  op: 'insert' | 'update' | 'upsert' | 'delete';
  payload: unknown;
  options: unknown;
}

export interface MockTableConfig {
  /** Rows a read of this table resolves to. */
  rows?: unknown[];
  /** If set, reads of this table fail with this error and return no rows. */
  readError?: MockPostgrestError | null;
  /** If set, writes to this table fail with this error. */
  writeError?: MockPostgrestError | null;
}

export interface MockSupabaseOptions {
  /** Session `auth.getSession()` resolves to. Default `null` (signed out). */
  session?: Session | null;
  /** Per-table read rows and failures, keyed by table name. */
  tables?: Record<string, MockTableConfig>;
}

interface MockAuthApi {
  getSession: Mock<() => Promise<{ data: { session: Session | null }; error: null }>>;
  onAuthStateChange: Mock<
    (callback: AuthChangeCallback) => {
      data: { subscription: { id: string; callback: AuthChangeCallback; unsubscribe: () => void } };
    }
  >;
  signInWithPassword: Mock<(credentials: unknown) => Promise<AuthCallResult>>;
  signUp: Mock<(credentials: unknown) => Promise<AuthCallResult>>;
  signInWithOAuth: Mock<(credentials: unknown) => Promise<AuthCallResult>>;
  signOut: Mock<() => Promise<{ error: null }>>;
}

type AuthChangeCallback = (event: string, session: Session | null) => void;
interface AuthCallResult {
  data: { user: User | null; session: Session | null };
  error: unknown;
}

export interface MockSupabase {
  /** Cast of the mock, to hand to `vi.mock('@/lib/supabase')`. */
  client: SupabaseClient;
  auth: MockAuthApi;
  /** Push an auth event to every `onAuthStateChange` subscriber. */
  emitAuthChange(event: string, session: Session | null): void;
  /** Replace a table's read rows mid-test. */
  setTable(table: string, config: MockTableConfig): void;
  /** Every insert/update/upsert/delete the app issued, in order. */
  readonly writes: readonly RecordedWrite[];
  /** Tables that were read, in order. */
  readonly reads: readonly string[];
  /** `true` once every `onAuthStateChange` subscription has been torn down. */
  allSubscriptionsClosed(): boolean;
}

interface Resolved {
  data: unknown;
  error: MockPostgrestError | null;
}

/**
 * A Supabase client that never touches the network.
 *
 * Use it as the module mock so no test can accidentally reach a real project:
 *
 * ```ts
 * const mock = createMockSupabaseClient({ tables: { profiles: { rows: [row] } } });
 * vi.mock('@/lib/supabase', () => ({ supabase: mock.client }));
 * ```
 *
 * `vi.mock` is hoisted above imports, so build the mock inside a
 * `vi.hoisted(() => ...)` block when the factory needs to close over it.
 *
 * The query builder is thenable and chainable, covering the shapes the app
 * actually uses: `.select().eq().maybeSingle()`, `.select().returns()`, and
 * `.upsert(payload, options)`.
 */
export function createMockSupabaseClient(options: MockSupabaseOptions = {}): MockSupabase {
  const tables = new Map<string, MockTableConfig>(Object.entries(options.tables ?? {}));
  const writes: RecordedWrite[] = [];
  const reads: string[] = [];
  const subscribers = new Map<string, AuthChangeCallback>();
  const openSubscriptions = new Set<string>();
  let nextSubscriptionId = 0;

  const authResult = (): AuthCallResult => ({
    data: { user: options.session?.user ?? null, session: options.session ?? null },
    error: null,
  });

  const auth: MockAuthApi = {
    getSession: vi.fn(async () => ({ data: { session: options.session ?? null }, error: null })),
    onAuthStateChange: vi.fn((callback: AuthChangeCallback) => {
      const id = `sub-${nextSubscriptionId++}`;
      subscribers.set(id, callback);
      openSubscriptions.add(id);
      return {
        data: {
          subscription: {
            id,
            callback,
            unsubscribe: () => {
              subscribers.delete(id);
              openSubscriptions.delete(id);
            },
          },
        },
      };
    }),
    signInWithPassword: vi.fn(async () => authResult()),
    signUp: vi.fn(async () => authResult()),
    signInWithOAuth: vi.fn(async () => authResult()),
    signOut: vi.fn(async () => ({ error: null })),
  };

  function from(table: string) {
    let resolve: () => Resolved = () => {
      reads.push(table);
      const config = tables.get(table);
      const error = config?.readError ?? null;
      return { data: error ? null : (config?.rows ?? []), error };
    };

    const recordWrite = (op: RecordedWrite['op']) => (payload: unknown, opts?: unknown) => {
      writes.push({ table, op, payload, options: opts ?? null });
      resolve = () => ({ data: null, error: tables.get(table)?.writeError ?? null });
      return builder;
    };

    const first = (): Resolved => {
      const { data, error } = resolve();
      if (error) return { data: null, error };
      const rows = Array.isArray(data) ? data : [];
      return { data: rows.length > 0 ? rows[0] : null, error: null };
    };

    const builder = {
      select: () => builder,
      eq: () => builder,
      neq: () => builder,
      in: () => builder,
      order: () => builder,
      limit: () => builder,
      returns: () => builder,
      match: () => builder,
      insert: recordWrite('insert'),
      update: recordWrite('update'),
      upsert: recordWrite('upsert'),
      delete: () => {
        writes.push({ table, op: 'delete', payload: null, options: null });
        resolve = () => ({ data: null, error: tables.get(table)?.writeError ?? null });
        return builder;
      },
      maybeSingle: async (): Promise<Resolved> => first(),
      single: async (): Promise<Resolved> => {
        const result = first();
        if (result.error === null && result.data === null) {
          return { data: null, error: makePostgrestError('No rows found', { code: 'PGRST116' }) };
        }
        return result;
      },
      // Awaiting the builder itself is the list form: `await from(t).select()`.
      then: <TResult,>(
        onFulfilled: (value: Resolved) => TResult | PromiseLike<TResult>,
      ): Promise<TResult> => Promise.resolve(resolve()).then(onFulfilled),
    };

    return builder;
  }

  const client = { auth, from: vi.fn(from) } as unknown as SupabaseClient;

  return {
    client,
    auth,
    emitAuthChange(event, session) {
      for (const callback of subscribers.values()) callback(event, session);
    },
    setTable(table, config) {
      tables.set(table, config);
    },
    get writes() {
      return writes;
    },
    get reads() {
      return reads;
    },
    allSubscriptionsClosed: () => openSubscriptions.size === 0,
  };
}

/* Re-exported so a test file needs one import for rendering, querying and
 * driving the browser stubs. */
export { setMatchMedia, triggerIntersection, getIntersectionObservers } from './setup';
export type { MockIntersectionObserver } from './setup';
export * from '@testing-library/react';
export { userEvent };
