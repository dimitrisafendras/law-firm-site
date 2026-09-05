-- =============================================================================
-- 0004_admin_user_management.sql
--
-- WHAT THIS DOES
--   Makes the admin user-management page (#admin-users) possible, and protects
--   the site from being locked out of its own admin tooling.
--
--   1. Two extra RLS policies on public.profiles, both gated on
--      public.is_admin():
--        profiles_select_admin -- an admin may SELECT every profile row.
--        profiles_update_admin -- an admin may UPDATE any profile row.
--      The own-row policies from 0001 (profiles_select_own /
--      profiles_update_own) are left untouched. RLS policies for the same
--      command are OR'd together, so a normal user still reads and updates
--      exactly their own row and nothing more, while an admin additionally
--      reaches everybody else's.
--
--   2. public.profiles_require_last_admin(), a BEFORE UPDATE trigger that
--      refuses any change which would take the number of admins to zero.
--
-- WHY THE LAST-ADMIN GUARD LIVES IN THE DATABASE
--   Nothing but a profile with role = 'admin' can edit site_content or manage
--   users. Demote the final admin and the site becomes permanently
--   un-administrable from the browser -- recovery would need the SQL editor or
--   a service_role key. The admin page greys out the offending buttons, but the
--   client is not a security boundary: the same UPDATE can be issued straight
--   at PostgREST with any signed-in admin's token. So the invariant "at least
--   one admin always exists" is enforced here, next to the data.
--
--   Concurrency: two admins demoting each other at the same instant would each
--   see one admin remaining and both succeed, ending at zero. The guard
--   therefore takes a FOR UPDATE row lock on the *other* admin rows while it
--   counts them, which serialises the two statements -- the second one re-runs
--   under READ COMMITTED against the committed result of the first, sees the
--   count fall to zero, and raises. Two simultaneous demotions can instead trip
--   Postgres' deadlock detector (each statement already holds its own target
--   row); that aborts one of them, which is the same safe outcome -- the page
--   reports adminUsersUpdateError and rolls the row back.
--
--   The guard is unconditional: unlike public.profiles_guard_role() from 0001
--   it does NOT stand down when auth.uid() is null, because this is a data
--   integrity invariant rather than an authorization rule -- a migration or a
--   service_role key has no more business leaving the site with no admin than a
--   browser does. A superuser who genuinely wants to tear the last admin down
--   can run `alter table public.profiles disable trigger
--   profiles_require_last_admin;` first.
--
--   Scope: UPDATE only. Rows leave public.profiles solely by cascade from
--   auth.users, which no browser client can reach (no DELETE grant, no DELETE
--   policy) -- deleting the owner's auth user from the dashboard is a
--   deliberate act and is not blocked here.
--
-- RUN ORDER
--   FOURTH (after 0003_seed_admin.sql). Requires public.profiles and
--   public.is_admin() from 0001_profiles_and_roles.sql.
--
-- RE-RUNNABLE
--   Yes. Both policies are dropped before being (re)created, the function uses
--   `create or replace`, and the trigger is dropped before being (re)created.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Last-admin guard
--
--    SECURITY DEFINER (owner = the table owner) so the count is taken over the
--    whole table without re-entering profiles RLS. The empty search_path means
--    every reference below is schema-qualified on purpose.
--
--    Trigger firing order matters and is alphabetical for BEFORE ROW triggers:
--    profiles_guard_role (0001) sorts before profiles_require_last_admin, so by
--    the time this function runs, NEW.role is already the final, authorised
--    value -- a non-admin's escalation attempt has been rejected upstream.
-- -----------------------------------------------------------------------------

create or replace function public.profiles_require_last_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_other_admins integer;
begin
  -- Only a demotion of a current admin can shrink the pool.
  if old.role is distinct from 'admin' or new.role = 'admin' then
    return new;
  end if;

  -- FOR UPDATE cannot be combined with an aggregate, hence the subquery: the
  -- inner select locks the remaining admin rows, the outer one counts them.
  select count(*)
  into v_other_admins
  from (
    select 1
    from public.profiles p
    where p.role = 'admin'
      and p.id <> old.id
    for update
  ) remaining;

  if v_other_admins = 0 then
    raise exception 'public.profiles must always contain at least one admin; % is the last one', old.email
      using errcode = '23514';  -- check_violation
  end if;

  return new;
end;
$$;

comment on function public.profiles_require_last_admin() is 'BEFORE UPDATE guard on public.profiles. Refuses a demotion that would leave the site with zero admins. Locks the remaining admin rows while counting so concurrent demotions cannot both slip through.';

revoke all on function public.profiles_require_last_admin() from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function public.profiles_require_last_admin() from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function public.profiles_require_last_admin() from authenticated;
  end if;
end;
$$;

drop trigger if exists profiles_require_last_admin on public.profiles;
create trigger profiles_require_last_admin
  before update on public.profiles
  for each row
  execute function public.profiles_require_last_admin();

-- -----------------------------------------------------------------------------
-- 2. Admin-wide RLS policies
--
--    The table grants from 0001 (`grant select, update on public.profiles to
--    authenticated`) already cover these commands; only the row filter is new.
--    public.is_admin() is SECURITY DEFINER, so calling it from a profiles
--    policy does not recurse back into profiles RLS.
-- -----------------------------------------------------------------------------

drop policy if exists profiles_select_admin on public.profiles;
create policy profiles_select_admin on public.profiles
  for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

comment on policy profiles_select_admin on public.profiles is 'Admins may read every profile (the #admin-users page). Non-admins keep only profiles_select_own.';
comment on policy profiles_update_admin on public.profiles is 'Admins may update any profile, i.e. promote / demote. Bounded by profiles_guard_role (id / email / created_at stay pinned) and profiles_require_last_admin.';
