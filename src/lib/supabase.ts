import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

const missing: string[] = []
if (!supabaseUrl) missing.push('VITE_SUPABASE_URL')
if (!supabasePublishableKey) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY')

if (missing.length > 0) {
  throw new Error(
    [
      `Supabase is not configured: missing ${missing.join(' and ')}.`,
      '',
      'Local dev: copy .env.example to .env.local, fill in the two values, then',
      'restart `npm run dev`. Vite reads env files only at server start, so a',
      'running dev server will not pick up a newly created .env.local.',
      '(.env.staging holds the staging values but is git-ignored, so a fresh',
      'clone will not have it — get them from a teammate or the Supabase',
      'dashboard. `npm run dev` runs in mode "development" and would not load',
      '.env.staging anyway; only `vite --mode staging` does.)',
      '',
      'CI / GitHub Pages: add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY',
      'as repository secrets so .github/workflows/deploy.yml can pass them to the',
      'build step.',
    ].join('\n'),
  )
}

/**
 * Shared browser Supabase client.
 *
 * The publishable key is public by design — it is compiled into the bundle and
 * visible to anyone. Row Level Security on the Supabase side is the actual
 * authorization boundary, never this key.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      // Keep the session in storage so a reload stays signed in.
      persistSession: true,
      // Refresh the access token in the background before it expires.
      autoRefreshToken: true,
      // Required for the OAuth redirect: the provider sends the user back with
      // the credential in the URL (a `?code=` for the default PKCE flow, or a
      // hash fragment for implicit). The client consumes it, establishes the
      // session, and strips it from the address bar.
      detectSessionInUrl: true,
    },
  },
)
