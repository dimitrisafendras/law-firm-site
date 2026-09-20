-- =============================================================================
-- 0005_client_visibility.sql
--
-- WHAT THIS DOES
--   Creates public.client_visibility, one row per client on the clients wall
--   recording whether an admin has hidden it. Anyone -- signed in or not -- may
--   read it, because the public marketing site has to know which clients to
--   leave out while logged out. Only a profile with role = 'admin' may write.
--   Also adds a BEFORE INSERT OR UPDATE trigger that stamps updated_at and
--   updated_by so the client never has to send them.
--
--   Absence of a row means VISIBLE. That is deliberate: adding a client to
--   src/components/sections/ClientsSection/clients.ts must not require a
--   database write before it appears, and a failed or empty fetch must leave
--   the wall showing what the code says rather than blanking it.
--
-- WHY A TABLE RATHER THAN site_content
--   site_content is keyed by (key, locale) and its rows are layered into the
--   i18n bundles by applyOverrideRows(). Visibility is neither copy nor
--   per-locale -- hiding a client hides it in both languages -- so riding that
--   table would mean inventing a fake locale and pushing a boolean through the
--   translation pipeline.
--
-- RUN ORDER
--   FIFTH. Requires 0001_profiles_and_roles.sql (public.profiles and
--   public.is_admin()).
--
-- RE-RUNNABLE
--   Yes. `create table if not exists`, `create or replace function`, and every
--   policy / trigger is dropped before being (re)created.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Table
-- -----------------------------------------------------------------------------

create table if not exists public.client_visibility (
  client_id  text        primary key,
  hidden     boolean     not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid        references public.profiles (id) on delete set null
);

comment on table  public.client_visibility            is 'Per-client visibility for the clients wall. A missing row means visible.';
comment on column public.client_visibility.client_id  is 'Matches the id in src/components/sections/ClientsSection/clients.ts.';
comment on column public.client_visibility.hidden     is 'True hides the client from every visitor. Admins in edit mode still see it, marked hidden.';
comment on column public.client_visibility.updated_by is 'Admin profile that last wrote this row. Stamped by the trigger, not by the client.';

-- Index the foreign key so deleting a profile does not force a seq scan.
create index if not exists client_visibility_updated_by_idx
  on public.client_visibility (updated_by);

-- -----------------------------------------------------------------------------
-- 2. Stamp updated_at / updated_by on every write
-- -----------------------------------------------------------------------------

create or replace function public.stamp_client_visibility()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();

  -- auth.uid() is null for server-side writes (migrations, service_role); leave
  -- whatever was supplied in that case rather than nulling out the audit trail.
  if auth.uid() is not null then
    new.updated_by := auth.uid();
  end if;

  return new;
end;
$$;

drop trigger if exists stamp_client_visibility on public.client_visibility;

create trigger stamp_client_visibility
  before insert or update on public.client_visibility
  for each row
  execute function public.stamp_client_visibility();

-- -----------------------------------------------------------------------------
-- 3. Row level security
-- -----------------------------------------------------------------------------

alter table public.client_visibility enable row level security;

drop policy if exists client_visibility_read_all    on public.client_visibility;
drop policy if exists client_visibility_write_admin on public.client_visibility;

-- Public read: the signed-out marketing site needs this to know what to omit.
create policy client_visibility_read_all
  on public.client_visibility
  for select
  using (true);

-- Admin write. `with check` as well as `using` so an admin cannot write a row
-- that they would then not be allowed to read back.
create policy client_visibility_write_admin
  on public.client_visibility
  for all
  using (public.is_admin())
  with check (public.is_admin());
