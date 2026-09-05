import { useContext } from 'react';
import { EditModeContext } from './context';
import type { EditModeState } from './context';

export function useEditMode(): EditModeState {
  const ctx = useContext(EditModeContext);
  if (!ctx) {
    throw new Error('useEditMode must be used inside an <EditModeProvider>');
  }
  return ctx;
}
