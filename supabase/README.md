# Supabase — database migrations

SQL for the auth + editable-content backend of the law firm site.

Everything under `migrations/` is **plain SQL, not applied automatically**. Nothing
in the app runs it. Someone has to apply it, once per environment, in filename
order.

```
supabase/migrations/
  0001_profiles_and_roles.sql      profiles table, sign-up trigger, is_admin(), RLS
  0002_site_content.sql            site_content table, stamp trigger, RLS
  0003_seed_admin.sql              promote dimitris.afendras@gmail.com to admin
  0004_admin_user_management.sql   admin-wide profiles policies, last-admin guard
  0005_client_visibility.sql       client_visibility table, stamp trigger, RLS
```

## Where things stand

The live project is **`law firm`** (`nyqfzoxdplvogflzkmpq`, eu-west-1). There is
no separate staging or dev database.

| Migration | State on `nyqfzoxdplvogflzkmpq` |
|---|---|
| `0001_profiles_and_roles.sql` | applied |
| `0002_site_content.sql` | applied |
| `0003_seed_admin.sql` | applied |
| `0004_admin_user_management.sql` | applied |
| `0005_client_visibility.sql` | applied |

`0004` was applied on **2026-09-25** through the SQL editor. Before that the
admin user-management page (`#admin-users`) could only see the signed-in admin's
own profile row — the own-row policies from `0001` were all that was in force.
Verified after applying: policies `profiles_select_admin` and
`profiles_update_admin` alongside the own-row pair, triggers
`profiles_guard_role` and `profiles_require_last_admin`, and the
`profiles_require_last_admin()` function present. Three admin rows exist, so the
last-admin guard has something to protect.

`0005` was applied on **2026-09-25** through the SQL editor. Before that the
clients wall's hide/show controls were inert: `GET /rest/v1/client_visibility`
returned **404** on `https://vkmlegal.gr` and the page logged
`[clients] could not load client_visibility`. The read failing was harmless by
design — absence of a row means visible, so the wall still showed every client
in `clients.ts` — but the write failed the same way, so nobody could be hidden.
Verified after applying: 4 columns, RLS on, policies
`client_visibility_read_all=SELECT` and `client_visibility_write_admin=ALL`,
trigger `stamp_client_visibility`, 0 rows; the same request now returns **200**.

An earlier `law-firm-stg` project (`lxjnhmizkdpdodpldwjr`) exists on the
`d.afendras@kiefer.gr` account from before the two-account split was understood.
It has `0001`–`0003` applied, is paused, and is not used by anything. Ignore it;
deleting it is a manual step in that account's dashboard.

## What each file sets up

**0001 — profiles and roles.** Creates `public.profiles` (`id` → `auth.users`,
`email`, `role`, `created_at`) with `role` constrained to `'user' | 'admin'`. An
`AFTER INSERT` trigger on `auth.users` (`public.handle_new_user`) writes the
profile row at sign-up, defaulting to `'user'` and giving `dimitris.afendras@gmail.com`
`'admin'`. Adds the `SECURITY DEFINER` helpers `public.is_admin()` and
`public.my_profile_role()`, which read the caller's own role without re-entering
`profiles` RLS. RLS lets a user `select` and `update` only their own row, and a
`BEFORE UPDATE` guard trigger (`public.profiles_guard_role`) plus the policy's
`WITH CHECK` make `role` non-self-writable — a user cannot promote themselves.
Ends by backfilling profiles for any `auth.users` rows that predate the trigger.

**0002 — site content.** Creates `public.site_content` (`key`, `locale`, `value`,
`updated_at`, `updated_by`, PK `(key, locale)`). `SELECT` is open to `anon` and
`authenticated` so the public site can render copy overrides while logged out;
`INSERT` / `UPDATE` / `DELETE` require `public.is_admin()`. A
`BEFORE INSERT OR UPDATE` trigger stamps `updated_at` and `updated_by`, so the
client never sends them.

**0003 — seed admin.** Idempotently sets `role = 'admin'` for
`dimitris.afendras@gmail.com` if that user already exists in `auth.users`. If they have
not signed up yet it prints a notice and does nothing — the 0001 trigger handles
that case at sign-up.

**0004 — admin user management.** Two more RLS policies on `public.profiles`,
both gated on `public.is_admin()`: `profiles_select_admin` (an admin may read
every row) and `profiles_update_admin` (an admin may update any row, i.e.
promote and demote). The own-row policies from 0001 are left alone — policies for
the same command are OR'd, so a normal user still reaches exactly their own row.
Also adds `public.profiles_require_last_admin()`, a `BEFORE UPDATE` trigger that
refuses any demotion which would take the number of admins to zero. It takes a
`FOR UPDATE` lock on the other admin rows while counting, so two admins demoting
each other concurrently cannot both slip through. The guard is deliberately
unconditional — it does not stand down for `service_role` or a migration the way
`profiles_guard_role` does, because "at least one admin exists" is a data
integrity invariant, not an authorization rule. To tear down the final admin on
purpose, `alter table public.profiles disable trigger profiles_require_last_admin;`
first.

**0005 — client visibility.** Creates `public.client_visibility` (`client_id`
primary key, `hidden`, `updated_at`, `updated_by`), one row per card on the
clients wall. `SELECT` is open to everyone, because the signed-out marketing
site has to know which clients to leave out; `INSERT` / `UPDATE` / `DELETE`
require `public.is_admin()`, with `with check` as well as `using` so an admin
cannot write a row they would then not be allowed to read back. A
`BEFORE INSERT OR UPDATE` trigger stamps `updated_at` and `updated_by`.
A missing row means VISIBLE, so adding a client to `clients.ts` needs no
database write before it appears.

## Applying a migration

Project ref: `nyqfzoxdplvogflzkmpq` (`https://nyqfzoxdplvogflzkmpq.supabase.co`).
The project belongs to the `dimitris.afendras@gmail.com` dashboard account, which
is not the account the MCP automation token authenticates as — so this is a
browser or CLI job, not something an agent can do for you.

### Option A — Supabase SQL editor (no tooling needed)

1. Open the project → **SQL Editor** → **New query**.
2. Paste the contents of the migration, run it, confirm success.
3. **Order matters** — 0002, 0003, 0004 and 0005 all depend on objects created by
   0001 (`public.profiles` and `public.is_admin()`).
4. Check the **Advisors** → **Security** tab afterwards; it should report no
   RLS-disabled tables in `public`.

The SQL editor runs as a privileged role with `auth.uid()` unset, which is
exactly what 0003 needs. Do not try to run these from the browser client.

### Option B — Supabase CLI

```bash
# one-time
npm i -g supabase           # or: brew install supabase/tap/supabase
supabase login
supabase init               # only creates supabase/config.toml; link needs it
supabase link --project-ref nyqfzoxdplvogflzkmpq

# apply
supabase db push
```

`supabase db push` applies every file in `supabase/migrations/` that the remote
project has not recorded yet, in filename order, and records them in
`supabase_migrations.schema_migrations` on the remote project.

> Two caveats. The filenames here are `0001_…`-style rather than the CLI's
> `<timestamp>_name.sql` convention; `db push` accepts them, but if your CLI
> version complains about the version format, rename them to
> `20250101000001_profiles_and_roles.sql` … `20250101000004_admin_user_management.sql`
> (keeping the same relative order) and re-run. And `0001`–`0003` were applied by
> hand through the SQL editor, so the remote has no migration history rows for
> them — a first `db push` will try to re-run all four. That is safe (see
> **Re-running**), but check the plan it prints before confirming.

### Option C — psql

```bash
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 \
  -f supabase/migrations/0004_admin_user_management.sql

psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 \n  -f supabase/migrations/0005_client_visibility.sql
```

Grab the connection string from **Project Settings → Database → Connection
string → URI** (use the session pooler string, and note it contains the database
password — keep it out of the repo and out of shell history).

## Standing up a fresh environment

If a second project is ever needed, apply `0001` → `0002` → `0003` → `0004` →
`0005` in order. Nothing in them is environment-specific except the hardcoded
admin email.

1. Create the Supabase project (or select it).
2. **Auth → URL Configuration**: set the Site URL to
   `https://dimitrisafendras.github.io/law-firm-site/` and add it (plus
   `http://localhost:5173/law-firm-site/` for local work) to the redirect
   allowlist. Without this, OAuth and email-confirmation links bounce.
3. Apply the five migrations using any option above.
4. Point the app at it by setting `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_PUBLISHABLE_KEY` to that project's values in the deploy
   environment. Do **not** commit them.
5. Re-run the **Advisors → Security** check.

## Re-running

All five files are safe to run again on an environment that already has them.
They use `create table if not exists`, `create or replace function`,
`drop policy if exists` before each `create policy`, `drop trigger if exists`
before each `create trigger`, and `on conflict do nothing` / `do update` for the
data writes. Re-running does not drop data or reset anyone's role except forcing
`dimitris.afendras@gmail.com` back to `admin`.

## Manual steps the repo owner must still do

These are **not** covered by the SQL and have to be done by hand in the Supabase
dashboard:

- ~~Apply `0004`.~~ Done — `0004` and `0005` were both applied on 2026-09-25.
  **No migration is outstanding.** See **Where things stand**.
- **Auth → URL Configuration** is set: Site URL `https://vkmlegal.gr`, redirect
  allowlist `https://vkmlegal.gr/**`, `https://www.vkmlegal.gr/**` and
  `http://localhost:5173/**` (set 2026-09-25; it had been left on the Supabase
  default `http://localhost:3000` with an empty allowlist, which broke sign-in
  on the live site). `www` was added the same day, once GitHub Pages reissued
  the apex certificate with both names in its SAN list; before that
  `https://www.vkmlegal.gr` had no TLS and an allowlist entry would have
  pointed at a host browsers refused to reach.
- **Leaked password protection stays off, and that is not a misconfiguration.**
  The Security Advisor warns about it, but the setting (Auth → Providers →
  Email, the HaveIBeenPwned check) is **Pro plan and above** and this project
  is on Free. Nothing in the dashboard can turn it on; only an upgrade can.
- **Sign up `dimitris.afendras@gmail.com`.** The migrations grant admin, they do not
  create the account. Sign up through the app (or **Auth → Users → Add user**),
  then optionally re-run `0003` to confirm the promotion.
- **Enable the OAuth providers** listed in `src/lib/auth/providers.ts`
  (**Auth → Providers**). Each needs a client ID and secret from the provider's
  own console, and the Supabase callback URL
  `https://<project-ref>.supabase.co/auth/v1/callback` registered on their side.
  Providers left disabled in the dashboard will fail at sign-in even if the
  config object marks them `enabled`.
- **Set the redirect URLs** (step 2 above).
- **Decide on email confirmation** (**Auth → Providers → Email**). With
  confirmations on, sign-up returns no session and the UI shows the
  `authCheckEmail` message; with them off, sign-up logs the user straight in.
- **Seed `site_content` if you want** — it is optional. An empty table just means
  the site falls back to the i18n bundles, which is the intended default.

## Verifying the security rules

Worth doing once after applying, from a normal signed-in (non-admin) session:

```js
// should fail — RLS blocks the write
await supabase.from('site_content').upsert({ key: 'heroTitle', locale: 'en', value: 'x' })

// should fail — role is not self-writable
await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id)

// should succeed, and return exactly one row (your own)
await supabase.from('profiles').select('*')
```

Logged out, `supabase.from('site_content').select('key, locale, value')` must
still succeed — that path is what renders the public site.

After `0004` is applied, from an **admin** session:

```js
// should return every profile, not just your own
await supabase.from('profiles').select('*')

// should fail if you are the only admin — the last-admin guard raises 23514
await supabase.from('profiles').update({ role: 'user' }).eq('id', user.id)
```
