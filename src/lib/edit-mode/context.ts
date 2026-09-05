import { createContext } from 'react';

export interface EditModeState {
  /** Whether the admin has unlocked editing. Meaningless for non-admins. */
  enabled: boolean;
  /** The only flag components should branch on: admin AND unlocked. */
  canEdit: boolean;
  setEnabled(next: boolean): void;
  toggle(): void;
}

/** Kept out of the provider module so that file exports only a component,
 *  which is what Fast Refresh needs to hot-reload it reliably. */
export const EditModeContext = createContext<EditModeState | null>(null);
