import { useCallback, useState } from 'react';
import i18n from '@/i18n';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/useAuth';

/** A single row of the `site_content` table. */
export interface SiteContentRow {
  key: string;
  locale: string;
  value: string;
}

export interface ContentEditorApi {
  saveOverride(key: string, locale: string, value: string): Promise<{ error: string | null }>;
  saving: boolean;
}

const NAMESPACE = 'translation';
const TABLE = 'site_content';

/**
 * Tell every react-i18next consumer that the resource store changed.
 * `useTranslation` binds to `languageChanged` by default, so re-emitting it is
 * the cheapest way to make merged DB overrides show up without a reload.
 */
function notifyTranslationConsumers(): void {
  i18n.emit('languageChanged', i18n.language);
}

/**
 * Merge `site_content` rows into i18next, grouped by locale.
 * Deep + overwrite, so DB values win over the static locale files while every
 * key that has no override keeps falling back to them.
 */
export function applyContentRows(rows: readonly SiteContentRow[]): void {
  const byLocale = new Map<string, Record<string, string>>();

  for (const row of rows) {
    if (!row || typeof row.key !== 'string' || typeof row.locale !== 'string') continue;
    if (typeof row.value !== 'string') continue;

    let bundle = byLocale.get(row.locale);
    if (!bundle) {
      bundle = {};
      byLocale.set(row.locale, bundle);
    }
    bundle[row.key] = row.value;
  }

  if (byLocale.size === 0) return;

  for (const [locale, bundle] of byLocale) {
    i18n.addResourceBundle(locale, NAMESPACE, bundle, true, true);
  }
  notifyTranslationConsumers();
}

/** Apply a single override into i18next immediately (no refetch). */
export function applyContentValue(key: string, locale: string, value: string): void {
  i18n.addResourceBundle(locale, NAMESPACE, { [key]: value }, true, true);
  notifyTranslationConsumers();
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

        applyContentValue(key, locale, value);
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
