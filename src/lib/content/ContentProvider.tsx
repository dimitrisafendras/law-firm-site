import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { applyContentRows } from './useContentEditor';
import type { SiteContentRow } from './useContentEditor';

interface ContentProviderProps {
  children: ReactNode;
}

/**
 * Loads admin-authored overrides from `site_content` and merges them into
 * i18next on top of the static locale files.
 *
 * The fetch is strictly additive: children render immediately and the static
 * locale files stay the fallback, so a slow or failing request only means the
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
          .returns<SiteContentRow[]>();

        if (cancelled) return;

        if (error) {
          console.warn('[content] could not load site_content overrides', error);
          return;
        }
        if (data && data.length > 0) applyContentRows(data);
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
