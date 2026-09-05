import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { applyOverrideRows, type OverrideRow } from '@/i18n/overrides';

interface ContentProviderProps {
  children: ReactNode;
}

/**
 * Loads admin-authored overrides from `site_content` and layers them over the
 * static locale files.
 *
 * The fetch is strictly additive: children render immediately and the static
 * bundles stay the fallback, so a slow or failing request only means the
 * visitor sees the shipped copy — never an error, never a blank screen.
 */
export function ContentProvider({ children }: ContentProviderProps) {
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('key, locale, value')
          .returns<OverrideRow[]>();

        if (cancelled) return;

        if (error) {
          console.warn('[content] could not load site_content overrides', error);
          return;
        }
        if (data && data.length > 0) applyOverrideRows(data);
      } catch (cause) {
        if (!cancelled) console.warn('[content] could not load site_content overrides', cause);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
