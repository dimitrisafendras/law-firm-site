-- =============================================================================
-- 0001_profiles_and_roles.sql
--
-- WHAT THIS DOES
--   Creates public.profiles (one row per auth.users row), an AFTER INSERT
--   trigger on auth.users that provisions the profile automatically, the
--   role-lookup helpers public.my_profile_role() / public.is_admin(), and the
--   RLS policies + guard trigger that let a user read and update ONLY their own
--   row while making the `role` column non-self-writable (no privilege
--   escalation).
--
-- RUN ORDER
--   FIRST. 0002_site_content.sql depends on public.is_admin() and on
--   public.profiles existing. 0003_seed_admin.sql depends on both.
--
-- RE-RUNNABLE
--   Yes. Every object uses `if not exists` / `or replace`, every policy and
--   trigger is dropped before being (re)created, and the backfill at the bottom
--   uses `on conflict do nothing`.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Table
-- -----------------------------------------------------------------------------

create table if not exists public.profiles (
  id         uuid        primary key references auth.users (id) on delete cascade,
  email      text        not null,
  role       text        not null default 'user',
  created_at timestamptz not null default now()
);

-- Constrain role to the two values the app's Profile type knows about.
-- Added separately so re-running the migration on an existing table works.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname  = 'profiles_role_check'
  ) then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('user', 'admin'));
  end if;
end;
$$;

comment on table  public.profiles      is 'Application profile for each auth.users row. Role drives admin-only write access to public.site_content.';
comment on column public.profiles.role is 'Either ''user'' or ''admin''. Not self-writable: see the profiles_guard_role trigger and the profiles_update_own policy.';

-- Admin tooling looks users up by email; the FK column id is already the PK.
create index if not exists profiles_email_idx on public.profiles (email);

-- -----------------------------------------------------------------------------
-- 2. Role-lookup helpers
--
--    Both are SECURITY DEFINER with an empty search_path so they bypass RLS on
--    public.profiles. That is deliberate: it lets the site_content policies (and
--    the profiles policies themselves) ask "is the caller an admin?" without
--    re-entering profiles RLS, which would recurse.
--
--    Neither takes an argument, so neither can be used to read another user's
--    role. They only ever report on the caller.
-- -----------------------------------------------------------------------------

create or replace function public.my_profile_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles p
  where p.id = (select auth.uid());
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select p.role = 'admin'
      from public.profiles p
      where p.id = (select auth.uid())
    ),
    false
  );
$$;

comment on function public.my_profile_role() is 'The calling user''s profile role, or null when unauthenticated. SECURITY DEFINER so it does not re-enter profiles RLS.';
comment on function public.is_admin()        is 'True when the calling user''s profile role is ''admin''. Used by the site_content write policies.';

revoke all on function public.my_profile_role() from public;
revoke all on function public.is_admin()        from public;

grant execute on function public.my_profile_role() to anon, authenticated, service_role;
grant execute on function public.is_admin()        to anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- 3. Auto-provision a profile whenever a user signs up
-- -----------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text;
begin
  -- auth.users.email is NULLABLE (phone sign-ups, and OAuth identities that
  -- withhold an address). public.profiles.email is NOT NULL, so a bare
  -- new.email would raise here -- and an exception in a trigger on auth.users
  -- aborts the whole sign-up with an opaque "Database error saving new user".
  -- Fall back to the identity payload, then to the empty string.
  v_email := coalesce(new.email, new.raw_user_meta_data ->> 'email', '');

  insert into public.profiles (id, email, role)
  values (
    new.id,
    v_email,
    case
      when lower(v_email) = 'd.afendras@kiefer.gr' then 'admin'
      else 'user'
    end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

comment on function public.handle_new_user() is 'AFTER INSERT trigger on auth.users. Creates the matching public.profiles row, promoting the firm owner to admin. Idempotent via on conflict do nothing; tolerates a null auth.users.email so sign-up never fails here.';

-- Least privilege: only the GoTrue role that inserts into auth.users needs this.
-- Postgres checks EXECUTE on a trigger function at CREATE TRIGGER time, not on
-- every fire, so the trigger below keeps working regardless.
-- REVOKE ... FROM PUBLIC is not sufficient on Supabase: ALTER DEFAULT PRIVILEGES
-- on the public schema hands anon and authenticated their own explicit EXECUTE
-- grants, and revoking from PUBLIC does not remove an explicit grant. Revoke
-- from those roles by name so the least-privilege intent above is actually in
-- force (and so the database linter stops flagging it).
revoke all on function public.handle_new_user() from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function public.handle_new_user() from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function public.handle_new_user() from authenticated;
  end if;
  if exists (select 1 from pg_roles where rolname = 'supabase_auth_admin') then
    grant execute on function public.handle_new_user() to supabase_auth_admin;
  end if;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 4. Guard trigger: role (and id / email / created_at) are not self-writable
--
--    The RLS WITH CHECK below also blocks role changes, but this trigger is the
--    belt to that suspenders: it covers every UPDATE path into the table, not
--    just the ones that go through the authenticated-role policy.
--
--    SECURITY INVOKER on purpose. When auth.uid() is null there is no end user
--    in play (migrations, the SQL editor, a service_role key), so the write is
--    let through -- that is what 0003_seed_admin.sql relies on. Anonymous
--    requests never reach this trigger because no RLS policy grants anon any
--    write on profiles.
-- -----------------------------------------------------------------------------

create or replace function public.profiles_guard_role()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- No authenticated end user => trusted server-side context. Allow.
  if (select auth.uid()) is null then
    return new;
  end if;

  -- Identity and creation time are never client-writable. email is mirrored
  -- from auth.users by handle_new_user() and is indexed for admin lookups, so
  -- letting a user rewrite it would let them impersonate another address in any
  -- tooling that resolves a profile by email.
  new.id         := old.id;
  new.email      := old.email;
  new.created_at := old.created_at;

  if new.role is distinct from old.role and not (select public.is_admin()) then
    raise exception 'profiles.role can only be changed by an admin'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

comment on function public.profiles_guard_role() is 'BEFORE UPDATE guard on public.profiles. Blocks privilege escalation by non-admins and pins id / email / created_at.';

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role
  before update on public.profiles
  for each row
  execute function public.profiles_guard_role();

-- -----------------------------------------------------------------------------
-- 5. Row Level Security
-- -----------------------------------------------------------------------------

alter table public.profiles enable row level security;

-- Table-level grants. Nobody may INSERT: rows arrive only via
-- public.handle_new_user(). Nobody may DELETE: rows go away with the auth user.
revoke all on public.profiles from anon;
revoke all on public.profiles from authenticated;
grant select, update on public.profiles to authenticated;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check (
    (select auth.uid()) = id
    and (
      -- role unchanged relative to what this user currently has ...
      role = (select public.my_profile_role())
      -- ... or the caller is an admin and may set it freely.
      or (select public.is_admin())
    )
  );

-- -----------------------------------------------------------------------------
-- 6. Backfill profiles for users that signed up before this trigger existed
-- -----------------------------------------------------------------------------

insert into public.profiles (id, email, role)
select
  u.id,
  u.email,
  case
    when lower(u.email) = 'd.afendras@kiefer.gr' then 'admin'
    else 'user'
  end
from auth.users u
where u.email is not null
on conflict (id) do nothing;
