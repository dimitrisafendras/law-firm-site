import type { Session, User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithPassword(email: string, password: string): Promise<{ error: string | null }>;
  signUpWithPassword(email: string, password: string): Promise<{ error: string | null }>;
  signInWithProvider(id: string): Promise<{ error: string | null }>;
  signOut(): Promise<void>;
}
