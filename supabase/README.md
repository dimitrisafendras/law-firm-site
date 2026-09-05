# Supabase — database migrations

SQL for the auth + editable-content backend of the law firm site.

Everything under `migrations/` is **plain SQL, not applied automatically**. Nothing
in the app runs it. Someone has to apply it, once per environment, in filename
order.

```
supabase/migrations/
  0001_profiles_and_roles.sql   profiles table, sign-up trigger, is_admin(), RLS
  0002_site_content.sql         site_content table, stamp trigger, RLS
  0003_seed_admin.sql           promote d.afendras@kiefer.gr to admin
```

## What each file sets up

**0001 — profiles and roles.** Creates `public.profiles` (`id` → `auth.users`,
`email`, `role`, `created_at`) with `role` constrained to `'user' | 'admin'`. An
`AFTER INSERT` trigger on `auth.users` (`public.handle_new_user`) writes the
profile row at sign-up, defaulting to `'user'` and giving `d.afendras@kiefer.gr`
`'admin'`. Adds the `SECURITY DEFINER` helpers `public.is_admin()` and
`public.my_profile_role()`, which read the caller's own role without re-entering
`profiles` RLS. RLS lets a user `select` and `update` only their own row, and a
`BEFORE UPDATE` guard trigger plus the policy's `WITH CHECK` make `role`
non-self-writable — a user cannot promote themselves. Ends by backfilling
profiles for any `auth.users` rows that predate the trigger.

**0002 — site content.** Creates `public.site_content` (`key`, `locale`, `value`,
`updated_at`, `updated_by`, PK `(key, locale)`). `SELECT` is open to `anon` and
`authenticated` so the public site can render copy overrides while logged out;
`INSERT` / `UPDATE` / `DELETE` require `public.is_admin()`. A
`BEFORE INSERT OR UPDATE` trigger stamps `updated_at` and `updated_by`, so the
client never sends them.

**0003 — seed admin.** Idempotently sets `role = 'admin'` for
`d.afendras@kiefer.gr` if that user already exists in `auth.users`. If they have
not signed up yet it prints a notice and does nothing — the 0001 trigger handles
that case at sign-up.

## Applying to **staging**

Project: `lxjnhmizkdpdodpldwjr` (`https://lxjnhmizkdpdodpldwjr.supabase.co`).

### Option A — Supabase SQL editor (no tooling needed)

1. Open the project → **SQL Editor** → **New query**.
2. Paste the contents of `0001_profiles_and_roles.sql`, run it, confirm success.
3. Repeat for `0002_site_content.sql`, then `0003_seed_admin.sql`.
   **Order matters** — 0002 and 0003 both depend on objects created by 0001.
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
supabase link --project-ref lxjnhmizkdpdodpldwjr

# apply
supabase db push
```

`supabase db push` applies every file in `supabase/migrations/` that the remote
project has not recorded yet, in filename order, and records them in
`supabase_migrations.schema_migrations` on the remote project.

> The filenames here are `0001_…`-style rather than the CLI's
> `<timestamp>_name.sql` convention. `db push` accepts them, but if your CLI
> version complains about the version format, rename them to
> `20250101000001_profiles_and_roles.sql`, `20250101000002_site_content.sql`,
> `20250101000003_seed_admin.sql` (keeping the same relative order) and re-run.

### Option C — psql

```bash
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 \
  -f supabase/migrations/0001_profiles_and_roles.sql \
  -f supabase/migrations/0002_site_content.sql \
  -f supabase/migrations/0003_seed_admin.sql
```

Grab the connection string from **Project Settings → Database → Connection
string → URI** (use the session pooler string, and note it contains the database
password — keep it out of the repo and out of shell history).

## Promoting staging to **production**

The same three files, in the same order, against the production project. Nothing
in them is environment-specific except the hardcoded admin email.

1. Create the production Supabase project (or select it).
2. **Auth → URL Configuration**: set the Site URL to
   `https://dimitrisafendras.github.io/law-firm-site/` and add it (plus
   `http://localhost:5173/law-firm-site/` for local work) to the redirect
   allowlist. Without this, OAuth and email-confirmation links bounce.
3. Apply `0001` → `0002` → `0003` using any option above (for the CLI:
   `supabase link --project-ref <prod-ref>` first, then `supabase db push`).
4. Point the app at production by setting `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_PUBLISHABLE_KEY` to the production project's values in the
   deploy environment. Do **not** commit them.
5. Re-run the **Advisors → Security** check.

## Re-running

All three files are safe to run again on an environment that already has them.
They use `create table if not exists`, `create or replace function`,
`drop policy if exists` before each `create policy`, `drop trigger if exists`
before each `create trigger`, and `on conflict do nothing` / `do update` for the
data writes. Re-running does not drop data or reset anyone's role except forcing
`d.afendras@kiefer.gr` back to `admin`.

## Manual steps the repo owner must still do

These are **not** covered by the SQL and have to be done by hand in the Supabase
dashboard:

- **Sign up `d.afendras@kiefer.gr`.** The migrations grant admin, they do not
  create the account. Sign up through the app (or **Auth → Users → Add user**),
  then optionally re-run `0003` to confirm the promotion.
- **Enable the OAuth providers** listed in `src/lib/auth/providers.ts`
  (**Auth → Providers**). Each needs a client ID and secret from the provider's
  own console, and the Supabase callback URL
  `https://<project-ref>.supabase.co/auth/v1/callback` registered on their side.
  Providers left disabled in the dashboard will fail at sign-in even if the
  config object marks them `enabled`.
- **Set the redirect URLs** (step 2 above) for staging as well as production.
- **Decide on email confirmation** (**Auth → Providers → Email**). With
  confirmations on, sign-up returns no session and the UI shows the
  `authCheckEmail` message; with them off, sign-up logs the user straight in.
- **Seed `site_content` if you want** — it is optional. An empty table just means
  the site falls back to the i18n bundles, which is the intended default.

## Verifying the security rules

Worth doing once on staging after applying, from a normal signed-in
(non-admin) session:

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
