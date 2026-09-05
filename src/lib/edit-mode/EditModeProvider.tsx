import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { EditModeContext } from './context';
import type { EditModeState } from './context';

const STORAGE_KEY = 'law-firm-site:edit-mode';

function readStored(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    // Private windows and blocked site data throw on access.
    return false;
  }
}

/**
 * Editing is locked by default and unlocked deliberately.
 *
 * That default matters for more than safety. Some copy — the hero title and
 * subtitle — is rendered by SpawnText, which splits it into one span per
 * character to animate the entrance. Editing needs a single contiguous text
 * node, so a component cannot be both at once. While editing is locked an admin
 * sees the site exactly as a visitor does, animation included; unlocking swaps
 * those strings for editable ones. The animation is only traded away while the
 * admin is actually editing.
 *
 * It also means an admin cannot nudge live copy by mis-clicking a heading.
 */
export function EditModeProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();

  // Read once during the initial render rather than in an effect: this app is
  // browser-only, so localStorage is available, and an effect would render the
  // locked state first and then immediately re-render.
  const [enabled, setEnabledState] = useState(readStored);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
    } catch {
      // Preference simply does not persist; the toggle still works this session.
    }
  }, []);

  // Kept pure: React double-invokes updaters under StrictMode, so the storage
  // write belongs in setEnabled, not inside the updater function.
  const toggle = useCallback(() => setEnabled(!enabled), [enabled, setEnabled]);

  // Losing admin (sign-out, or a demotion) must drop edit affordances
  // immediately rather than leaving a stale unlocked flag behind.
  const canEdit = isAdmin && enabled;

  const value = useMemo<EditModeState>(
    () => ({ enabled, canEdit, setEnabled, toggle }),
    [enabled, canEdit, setEnabled, toggle],
  );

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
}
