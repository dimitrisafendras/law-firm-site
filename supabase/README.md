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
```

## Where things stand

The live project is **`law firm`** (`nyqfzoxdplvogflzkmpq`, eu-west-1). There is
no separate staging or dev database.

| Migration | State on `nyqfzoxdplvogflzkmpq` |
|---|---|
| `0001_profiles_and_roles.sql` | applied |
| `0002_site_content.sql` | applied |
| `0003_seed_admin.sql` | applied |
| `0004_admin_user_management.sql` | **not applied** |

`0004` is committed but has not been run against the project. Until it is, the
admin user-management page (`#admin-users`) can only see the signed-in admin's
own profile row — the own-row policies from `0001` are all that is in force.

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

## Applying a migration

Project ref: `nyqfzoxdplvogflzkmpq` (`https://nyqfzoxdplvogflzkmpq.supabase.co`).
The project belongs to the `dimitris.afendras@gmail.com` dashboard account, which
is not the account the MCP automation token authenticates as — so this is a
browser or CLI job, not something an agent can do for you.

### Option A — Supabase SQL editor (no tooling needed)

1. Open the project → **SQL Editor** → **New query**.
2. Paste the contents of the migration, run it, confirm success.
3. **Order matters** — 0002, 0003 and 0004 all depend on objects created by 0001.
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
```

Grab the connection string from **Project Settings → Database → Connection
string → URI** (use the session pooler string, and note it contains the database
password — keep it out of the repo and out of shell history).

## Standing up a fresh environment

If a second project is ever needed, apply `0001` → `0002` → `0003` → `0004` in
order. Nothing in them is environment-specific except the hardcoded admin email.

1. Create the Supabase project (or select it).
2. **Auth → URL Configuration**: set the Site URL to
   `https://dimitrisafendras.github.io/law-firm-site/` and add it (plus
   `http://localhost:5173/law-firm-site/` for local work) to the redirect
   allowlist. Without this, OAuth and email-confirmation links bounce.
3. Apply the four migrations using any option above.
4. Point the app at it by setting `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_PUBLISHABLE_KEY` to that project's values in the deploy
   environment. Do **not** commit them.
5. Re-run the **Advisors → Security** check.

## Re-running

All four files are safe to run again on an environment that already has them.
They use `create table if not exists`, `create or replace function`,
`drop policy if exists` before each `create policy`, `drop trigger if exists`
before each `create trigger`, and `on conflict do nothing` / `do update` for the
data writes. Re-running does not drop data or reset anyone's role except forcing
`dimitris.afendras@gmail.com` back to `admin`.

## Manual steps the repo owner must still do

These are **not** covered by the SQL and have to be done by hand in the Supabase
dashboard:

- **Apply `0004`.** It is the only migration still outstanding.
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
