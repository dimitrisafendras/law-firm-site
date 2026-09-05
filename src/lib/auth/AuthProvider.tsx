import { useCallback, useEffect, useMemo, useState } from 'react';
import type { JSX, ReactNode } from 'react';
import type { AuthError, Provider, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContext } from './useAuth';
import type { AuthState, Profile } from './types';

interface AuthProviderProps {
  children: ReactNode;
}

interface FetchedProfile {
  userId: string;
  profile: Profile | null;
}

/** Never leak a raw Supabase message — callers t() the returned key. */
function mapAuthError(error: AuthError | null): string | null {
  if (!error) return null;

  const isInvalidCredentials =
    error.code === 'invalid_credentials' ||
    /invalid login credentials/i.test(error.message);

  return isInvalidCredentials ? 'authErrorInvalidCredentials' : 'authErrorGeneric';
}

/** The client is untyped against the DB schema, so narrow the row by hand. */
function toProfile(row: unknown): Profile | null {
  if (row === null || typeof row !== 'object') return null;

  const { id, email, role } = row as Record<string, unknown>;
  if (typeof id !== 'string' || typeof email !== 'string') return null;

  return { id, email, role: role === 'admin' ? 'admin' : 'user' };
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionResolved, setSessionResolved] = useState(false);
  const [fetched, setFetched] = useState<FetchedProfile | null>(null);

  const user = session?.user ?? null;
  const userId = user?.id ?? null;

  // Derived rather than stored, so no effect ever has to write state
  // synchronously to keep them in sync with the current user.
  const profileResolved = userId === null || fetched?.userId === userId;
  const profile = userId !== null && fetched?.userId === userId ? fetched.profile : null;
  const loading = !sessionResolved || !profileResolved;

  useEffect(() => {
    let active = true;
    // onAuthStateChange is the live source of truth. Once it has fired, a
    // late-resolving getSession() must not clobber the newer session (e.g. a
    // sign-in that completes while the initial read is still in flight).
    let sawAuthEvent = false;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active || sawAuthEvent) return;
        setSession(data.session);
      })
      .catch(() => {
        if (!active || sawAuthEvent) return;
        setSession(null);
      })
      .finally(() => {
        if (!active) return;
        setSessionResolved(true);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      sawAuthEvent = true;
      if (!active) return;
      setSession(nextSession);
      setSessionResolved(true);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Kept out of the onAuthStateChange callback on purpose: calling back into
  // supabase from inside that callback can deadlock the auth lock.
  useEffect(() => {
    if (!sessionResolved || userId === null) return;

    let active = true;

    void (async () => {
      let row: unknown = null;

      try {
        const { data } = await supabase
          .from('profiles')
          .select('id, email, role')
          .eq('id', userId)
          .maybeSingle();
        row = data;
      } catch {
        row = null;
      }

      if (!active) return;
      setFetched({ userId, profile: toProfile(row) });
    })();

    return () => {
      active = false;
    };
  }, [sessionResolved, userId]);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: mapAuthError(error) };
  }, []);

  const signUpWithPassword = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: mapAuthError(error) };
  }, []);

  const signInWithProvider = useCallback(async (id: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: id as Provider,
      options: {
        // Return to the GitHub Pages base path, not the bare origin.
        redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
      },
    });
    return { error: mapAuthError(error) };
  }, []);

  const signOut = useCallback(async () => {
    // Contract signature is Promise<void>, so callers have no error channel and
    // will typically fire this without awaiting. Swallow transport failures here
    // rather than surfacing them as an unhandled rejection; the local session is
    // cleared either way so the UI still returns to a signed-out state.
    try {
      await supabase.auth.signOut();
    } catch {
      setSession(null);
      setSessionResolved(true);
    }
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      session,
      user,
      profile,
      isAdmin: profile?.role === 'admin',
      loading,
      signInWithPassword,
      signUpWithPassword,
      signInWithProvider,
      signOut,
    }),
    [
      session,
      user,
      profile,
      loading,
      signInWithPassword,
      signUpWithPassword,
      signInWithProvider,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
