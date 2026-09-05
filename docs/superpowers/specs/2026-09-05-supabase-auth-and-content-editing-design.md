# Supabase Auth + Admin Content Editing — Design

Date: 2026-09-05
Repo: dimitrisafendras/law-firm-site
Status: approved (in chat, 2026-09-05). Built: auth and content editing are
implemented and wired across the site; migrations 0001-0003 are applied to the
live project. See **Migration status** and **Wiring it through the site**
below.

## Goal

Add signup/login (email/password + OAuth providers) to the law firm site, and
let admin accounts edit every piece of site copy inline.

The original plan was to ship to a staging Supabase project and then promote the
identical schema to production. That did not survive the account split described
under **Environments**: there is one project, and it is the live one.

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
- **A visitor's DOM must stay byte-identical.** Making copy editable may not
  change what a logged-out visitor's browser renders: same elements, same
  classes, same nesting, same text nodes, no extra wrappers or attributes. The
  layout CSS, the scroll animations and the hero entrance are all written
  against the existing markup, so any additional node is a visual regression for
  everyone who is not signed in — which is everyone. This is the rule every
  wiring decision below was made against, and it is why `EditableText` returns
  `<As className={className} {...elementProps}>{t(key)}</As>` and nothing else
  when `isAdmin` is false.

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

### Migration status

| Migration | State on `law firm` (`nyqfzoxdplvogflzkmpq`) |
|---|---|
| `0001_profiles_and_roles.sql` | applied |
| `0002_site_content.sql` | applied |
| `0003_seed_admin.sql` | applied |
| `0004_admin_user_management.sql` | **not applied** |

`0001`-`0003` are live: `profiles` and `site_content` both exist with RLS on.

`0004_admin_user_management.sql` is in the repo and has **not** been applied.
It adds two `is_admin()`-gated RLS policies on `profiles` — `profiles_select_admin`
and `profiles_update_admin`, OR'd with the own-row policies from 0001 so an admin
additionally reaches every row — plus a `profiles_require_last_admin` BEFORE
UPDATE trigger that refuses any demotion which would leave the site with zero
admins. That guard lives in the database rather than the page because the client
is not a security boundary: the same `UPDATE` can be issued straight at PostgREST
with a signed-in admin's token.

Until it is applied, the admin user-management page (`#admin-users`) cannot read
or update anyone else's profile row — the own-row policies from 0001 are all
that is in force. Applying it is a manual step in the SQL editor, for the same
reason as everything else here: the project belongs to the dashboard account,
which the automation token cannot reach.

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

The admin account is `dimitris.afendras@gmail.com` — the dashboard account, not
the `d.afendras@kiefer.gr` automation identity described under **Environments**.
It is granted `admin`. The migration handles both cases:
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

### Wiring it through the site

Editing is live across the page, not just on a demo. Three things made that
possible without breaking the byte-identical-DOM rule.

**`EditableText` is invisible to a visitor.** Its whole contract is one line:
for anyone who is not an admin it returns
`<As className={className} {...elementProps}>{t(key)}</As>` and nothing else.
That is what lets it be dropped in anywhere copy is rendered — the visitor
markup is the same markup that was there before.

`elementProps` is the escape hatch that keeps that true for a link. Wiring the
visible text of an `<a href="mailto:…">` would otherwise mean nesting a span
inside the anchor, which is a new node; passing the `href` through
`elementProps` instead makes the anchor itself the rendered element. For an
admin, `EditableText` swaps an interactive tag (`a`, `button`) for a `span`
while the textarea is open — an anchor would navigate on click rather than open
the editor, and a `<textarea>` inside one is not legal markup — and calls
`preventDefault()` on the click that starts editing. That substitution happens
only in the admin branch, so the visitor DOM is untouched.

**`SectionHeader` gained `*Key` props.** `overlineKey`, `titleKey`, `subtitleKey`
and `labelKey` sit alongside the existing `overline` / `title` / `subtitle` /
`label` string props. Passing a key renders that slot through `EditableText`
with the same element and the same class the string branch used; passing a
string keeps the old behaviour. Nothing had to be migrated in one go, and
callers that legitimately pass literals rather than translations — the design
system showcase — still work.

**`EditableSpawnText` resolves the hero conflict by viewer, not by markup.**
`SpawnText` splits a string into one span per character or word to drive the
entrance animation; `EditableText` needs a single contiguous text node to edit.
Neither can wrap the other, which is why the hero title and subtitle were at
first the only copy on the site an admin could not change. The fix branches on
role: a visitor gets `SpawnText` exactly as before, byte-identical and fully
animated, and an admin gets a plain editable string instead. The admin loses
the entrance animation, which is the right way round — the animation plays once
on load, editing is the reason they signed in.

With those in place the sections are wired: hero, stats bar, practice grid,
partner ethos, network map, testimonials, CTA and contact.

## Components

New, each with its own directory, CSS file, barrel export, and an entry in
`DesignSystem.tsx`:

- `AuthForm` — shared email/password form shell
- `ProviderButtons` — renders the provider config array
- `EditableText` — the inline-edit wrapper
- `EditableSpawnText` — the hero variant, `SpawnText` for visitors and
  `EditableText` for admins
- `AuthNavControl` — the navbar affordance: sign-in link, account link, admin
  badge, and nothing at all while the session resolves
- `LoginPage`, `SignupPage`, `AccountPage`

Changed rather than new:

- `SectionHeader` — the `*Key` prop variants described above

Existing `Input`, `Button`, `Card`, `Text` primitives are reused rather than
reimplemented.

Supporting non-component modules: `src/lib/auth/` (`AuthProvider`, `useAuth`,
`providers.ts`, `types.ts`), `src/lib/content/` (`ContentProvider`,
`useContentEditor`) and `src/lib/supabase.ts`.

## Risks

- Public signup means anyone can create an account. Accepted: non-admin accounts
  have no privileges beyond reading their own profile row.
- Build-time env inlining means rotating a Supabase key requires a redeploy.
- Free-tier projects pause after inactivity. If the site starts falling back to
  the static i18n bundles and sign-in fails, check whether the project needs a
  restore from the dashboard before debugging anything in the app.
- `0004` is written but not applied, so admin user management is not usable in
  the live project yet. Nothing else regresses in the meantime.
- The last-admin guard is unconditional — it does not stand down for
  `service_role` or for a migration. Tearing down the final admin on purpose
  means disabling the trigger first.
