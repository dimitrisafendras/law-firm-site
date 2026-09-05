import { createContext, useContext } from 'react';
import type { AuthState } from './types';

/**
 * Lives here rather than in AuthProvider.tsx so that the component module keeps
 * a component-only export (Fast Refresh / react-refresh lint rule).
 */
export const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used within an <AuthProvider>.');
  }

  return context;
}
