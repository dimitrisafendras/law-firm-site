-- =============================================================================
-- 0003_seed_admin.sql
--
-- WHAT THIS DOES
--   Promotes the firm owner (dimitris.afendras@gmail.com) to role = 'admin'.
--
--   This covers the case where that account signed up BEFORE the trigger in
--   0001 existed, or where its role was changed by hand. If the account has not
--   been created in auth.users yet, this is a NO-OP -- not an error -- because
--   public.handle_new_user() from 0001 will assign 'admin' the moment they
--   sign up.
--
-- RUN ORDER
--   THIRD (last). Requires 0001_profiles_and_roles.sql.
--
-- RE-RUNNABLE
--   Yes. Wrapped in a DO block that no-ops on a missing user and upserts
--   otherwise, so running it any number of times converges on the same state.
--
-- NOTE
--   public.profiles_guard_role() (from 0001) lets this through because
--   auth.uid() is null in a migration / SQL-editor session. Run this as the
--   postgres role or via the Supabase SQL editor -- NOT from the browser client.
-- =============================================================================

do $$
declare
  v_admin_email constant text := 'dimitris.afendras@gmail.com';
  v_user_id     uuid;
  v_user_email  text;
begin
  -- Match case-insensitively, but keep the address exactly as auth.users stores
  -- it: public.profiles.email mirrors auth.users.email, and AccountPage renders
  -- it. Writing the lowercased literal back would desync the two.
  select u.id, u.email
  into v_user_id, v_user_email
  from auth.users u
  where lower(u.email) = v_admin_email
  order by u.created_at
  limit 1;

  if v_user_id is null then
    raise notice
      'seed_admin: no auth.users row for %. Nothing to do -- the on_auth_user_created trigger will grant admin at sign-up.',
      v_admin_email;
    return;
  end if;

  insert into public.profiles (id, email, role)
  values (v_user_id, v_user_email, 'admin')
  on conflict (id) do update
    set role  = 'admin',
        email = excluded.email
  where profiles.role is distinct from 'admin'
     or profiles.email is distinct from excluded.email;

  raise notice 'seed_admin: % (%) is now an admin.', v_user_email, v_user_id;
end;
$$;
