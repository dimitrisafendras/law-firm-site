import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { applyOverride } from '@/i18n/overrides';

const TABLE = 'site_content';

export interface ContentEditorApi {
  saveOverride(key: string, locale: string, value: string): Promise<{ error: string | null }>;
  saving: boolean;
}

export function useContentEditor(): ContentEditorApi {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const userId = user?.id ?? null;

  const saveOverride = useCallback(
    async (key: string, locale: string, value: string): Promise<{ error: string | null }> => {
      setSaving(true);
      try {
        const { error } = await supabase.from(TABLE).upsert(
          {
            key,
            locale,
            value,
            updated_at: new Date().toISOString(),
            updated_by: userId,
          },
          { onConflict: 'key,locale' },
        );

        if (error) {
          console.warn('[content] failed to save override', key, locale, error);
          return { error: 'editError' };
        }

        // Apply locally so the edit is visible immediately, with no refetch.
        applyOverride(locale, key, value);
        return { error: null };
      } catch (cause) {
        console.warn('[content] failed to save override', key, locale, cause);
        return { error: 'editError' };
      } finally {
        setSaving(false);
      }
    },
    [userId],
  );

  return { saveOverride, saving };
}
