-- =============================================================================
-- 0002_site_content.sql
--
-- WHAT THIS DOES
--   Creates public.site_content, the per-(key, locale) override table behind the
--   in-place copy editor. Anyone -- signed in or not -- may read it, because the
--   public marketing site renders these overrides on top of the i18n bundles
--   while logged out. Only a profile with role = 'admin' may write.
--   Also adds a BEFORE INSERT OR UPDATE trigger that stamps updated_at and
--   updated_by so the client never has to send them.
--
-- RUN ORDER
--   SECOND. Requires 0001_profiles_and_roles.sql (public.profiles and
--   public.is_admin()).
--
-- RE-RUNNABLE
--   Yes. `create table if not exists`, `create or replace function`, and every
--   policy / trigger is dropped before being (re)created.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Table
-- -----------------------------------------------------------------------------

create table if not exists public.site_content (
  key        text        not null,
  locale     text        not null,
  value      text        not null,
  updated_at timestamptz not null default now(),
  updated_by uuid        references public.profiles (id) on delete set null,
  primary key (key, locale)
);

comment on table  public.site_content            is 'Admin-editable overrides for i18n copy, keyed by translation key + locale. Publicly readable so the site renders overrides while logged out.';
comment on column public.site_content.key        is 'The react-i18next translation key this row overrides.';
comment on column public.site_content.locale     is 'Locale code, matching the i18n bundles (e.g. ''en'', ''el'').';
comment on column public.site_content.updated_by is 'Admin profile that last wrote this row. Stamped by the trigger, not by the client.';

-- The site loads one whole locale at a time; the PK is (key, locale) so its
-- index cannot serve a locale-only lookup.
create index if not exists site_content_locale_idx on public.site_content (locale);

-- Index the foreign key so deleting a profile does not force a seq scan.
create index if not exists site_content_updated_by_idx on public.site_content (updated_by);

-- -----------------------------------------------------------------------------
-- 2. Stamp updated_at / updated_by on every write
-- -----------------------------------------------------------------------------

create or replace function public.stamp_site_content()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();

  -- auth.uid() is null for server-side writes (migrations, service_role); leave
  -- whatever was supplied in that case rather than nulling out the audit trail.
  if (select auth.uid()) is not null then
    new.updated_by := (select auth.uid());
  end if;

  return new;
end;
$$;

comment on function public.stamp_site_content() is 'BEFORE INSERT OR UPDATE trigger on public.site_content. Keeps updated_at current and records the writing admin.';

drop trigger if exists site_content_stamp on public.site_content;
create trigger site_content_stamp
  before insert or update on public.site_content
  for each row
  execute function public.stamp_site_content();

-- -----------------------------------------------------------------------------
-- 3. Row Level Security
-- -----------------------------------------------------------------------------

alter table public.site_content enable row level security;

revoke all on public.site_content from anon;
revoke all on public.site_content from authenticated;
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;

-- Read: everyone, including logged-out visitors.
drop policy if exists site_content_select_public on public.site_content;
create policy site_content_select_public on public.site_content
  for select
  to anon, authenticated
  using (true);

-- Write: admins only. public.is_admin() is SECURITY DEFINER, so evaluating it
-- here does not trigger profiles RLS.
drop policy if exists site_content_insert_admin on public.site_content;
create policy site_content_insert_admin on public.site_content
  for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists site_content_update_admin on public.site_content;
create policy site_content_update_admin on public.site_content
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists site_content_delete_admin on public.site_content;
create policy site_content_delete_admin on public.site_content
  for delete
  to authenticated
  using ((select public.is_admin()));
