export interface AuthProviderConfig {
  /** Supabase provider id, passed straight to supabase.auth.signInWithOAuth. */
  id: string;
  /** i18n key — resolve with t() at render time, never render directly. */
  label: string;
  enabled: boolean;
}

/**
 * Every provider is off until its credentials exist in Supabase. Enabling one
 * here without configuring it there renders a button that sends the user to a
 * dead redirect, so `enabled` tracks the Supabase dashboard, not our ambition.
 *
 * With none enabled, AuthForm drops the "or continue with" divider and
 * ProviderButtons renders nothing — email/password stands alone.
 */
export const authProviders: AuthProviderConfig[] = [
  { id: 'google', label: 'authProviderGoogle', enabled: false },
  { id: 'github', label: 'authProviderGithub', enabled: false },
  { id: 'apple', label: 'authProviderApple', enabled: false },
  { id: 'linkedin_oidc', label: 'authProviderLinkedin', enabled: false },
];
