/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL, e.g. https://xxxxxxxx.supabase.co */
  readonly VITE_SUPABASE_URL: string
  /** Supabase publishable (anon) key — public by design; RLS is the boundary. */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
