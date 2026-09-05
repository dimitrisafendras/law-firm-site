export interface AuthProviderConfig {
  /** Supabase provider id, passed straight to supabase.auth.signInWithOAuth. */
  id: string;
  /** i18n key — resolve with t() at render time, never render directly. */
  label: string;
  enabled: boolean;
}

export const authProviders: AuthProviderConfig[] = [
  { id: 'google', label: 'authProviderGoogle', enabled: true },
  { id: 'github', label: 'authProviderGithub', enabled: true },
  { id: 'apple', label: 'authProviderApple', enabled: false },
  { id: 'linkedin_oidc', label: 'authProviderLinkedin', enabled: false },
];
