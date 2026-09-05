# Supabase Auth + Admin Content Editing — Design

Date: 2026-09-05
Repo: dimitrisafendras/law-firm-site
Status: approved (in chat, 2026-09-05)

## Goal

Add signup/login (email/password + OAuth providers) to the law firm site, and
let admin accounts edit every piece of site copy inline. Ship to a staging
Supabase project first, then promote the identical schema to production.

## Constraints discovered

- Site is a static SPA deployed to GitHub Pages (`.github/workflows/deploy.yml`),
  Vite `base: '/law-firm-site/'`. No server, no rewrites. Routing must be
  hash-based.
- All copy lives as 182 flat keys x 2 locales in `src/i18n/locales/{en,el}.ts`,
  loaded statically into i18next at boot (`src/i18n/index.ts`).
- Existing routing is a hand-rolled `hashchange` switch in `src/App.tsx`.
- Theme rule (CLAUDE.md): every design value must come from `src/theme/tokens.ts`
  via CSS custom properties. No raw hex, font, or spacing literals.
- Standing rule: every new component/variant must be shown in
  `src/pages/DesignSystem.tsx`.

## Environments

One Supabase project, used for everything. There is no staging and no dev
database.

| Project | Ref | Region |
|---|---|---|
| law firm | nyqfzoxdplvogflzkmpq | eu-west-1 |

Two constraints shaped this:

- The dashboard session (`dimitris.afendras@gmail.com`) and the MCP automation
  token (`d.afendras@kiefer.gr`) are different accounts. The project above
  belongs to the dashboard account, so the automation token cannot reach it and
  everything is done through the browser.
- Supabase branching is Pro-only, and branch compute is billed at $0.01344/hour
  for as long as the branch exists (~$9.68/month) on top of the Pro upgrade.
  Not taken.

An earlier `law-firm-stg` project (`lxjnhmizkdpdodpldwjr`) was created on the
kiefer.gr account before the account split was understood. It has the full schema
applied. It is now paused and unused; deleting it is a manual step in the
kiefer.gr dashboard.

Config via Vite env vars, `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`,
from a gitignored `.env.local` locally and repository secrets in CI. Publishable
keys are public by design; RLS is the security boundary, not the key.

Both `main` and `dev` build against this single project. Only `main` publishes to
Pages, since Pages serves one site.

## Auth

### Providers

Email/password and magic link are enabled directly.

OAuth providers each require a client ID and secret registered in that
provider's own console (Google Cloud, GitHub Developer Settings, etc.). Those
credentials must be created by the repo owner; they are not something the
implementation can provision.

The login UI is therefore driven by a single config array
(`src/lib/auth/providers.ts`). Enabling a new provider is a dashboard action
plus one array entry — no component changes. Ship wired: Google, GitHub,
email/password. Everything else scaffolded.

Redirect URL for every provider: the deployed Pages origin plus base path, and
`http://localhost:5173/law-firm-site/` for local work.

### Routes

Extend the existing hash switch in `src/App.tsx`:

- `#login`
- `#signup`
- `#account`

No react-router. Hash routing needs no server rewrites and OAuth returns
cleanly to the base URL.

### Session

A `SupabaseProvider` + `useAuth()` context wraps the app, exposing
`session`, `user`, `profile`, `isAdmin`, and the sign-in/out calls. It
subscribes to `onAuthStateChange` and unsubscribes on unmount.

## Data model

```sql
-- profiles
id          uuid primary key references auth.users on delete cascade
email       text not null
role        text not null default 'user'   -- 'user' | 'admin'
created_at  timestamptz not null default now()

-- site_content
key         text not null
locale      text not null                  -- 'en' | 'el'
value       text not null
updated_at  timestamptz not null default now()
updated_by  uuid references auth.users
primary key (key, locale)
```

A trigger on `auth.users` insert creates the matching `profiles` row.

`d.afendras@kiefer.gr` is granted `admin`. The migration handles both cases:
it updates the row if that user already exists, and the trigger checks the
email on future signup so the grant applies whichever order things happen in.

### RLS

- `profiles`: a user may select and update their own row. `role` is not
  self-writable — enforced by a check that rejects role changes from non-admins.
- `site_content`: `select` is public (anon included). `insert`/`update`/`delete`
  require the caller's profile role to be `admin`.

## Content editing

### Override layer

On boot the app fetches all `site_content` rows and merges them over the static
bundle with `i18n.addResourceBundle(locale, 'translation', overrides, true, true)`.

The static locale files remain the defaults. Consequences:

- The site renders correct copy if Supabase is slow, down, or unreachable.
- Only edited keys ever occupy a DB row.
- Adding new copy is still a normal code change.

### Editing UX

When `isAdmin` is true, text rendered through the editable wrapper gains an edit
affordance: click to make it editable in place, save to upsert
`(key, locale, value)`, escape to cancel. Non-admin and logged-out visitors see
an unchanged site — the wrapper renders a plain string.

Editing targets the currently active locale, so switching language and editing
again produces the Greek copy for the same key.

## Components

New, each with its own directory, CSS file, barrel export, and an entry in
`DesignSystem.tsx`:

- `AuthForm` — shared email/password form shell
- `ProviderButtons` — renders the provider config array
- `EditableText` — the inline-edit wrapper
- `LoginPage`, `SignupPage`, `AccountPage`

Existing `Input`, `Button`, `Card`, `Text` primitives are reused rather than
reimplemented.

## Risks

- Public signup means anyone can create an account. Accepted: non-admin accounts
  have no privileges beyond reading their own profile row.
- Build-time env inlining means rotating a Supabase key requires a redeploy.
- Free-tier projects pause after inactivity; staging may need a restore before
  a later session.
