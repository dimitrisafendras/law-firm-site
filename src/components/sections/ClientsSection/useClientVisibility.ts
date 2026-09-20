import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const TABLE = 'client_visibility';

interface VisibilityRow {
  client_id: string;
  hidden: boolean;
}

export interface ClientVisibilityApi {
  /** True when this client has been hidden by an admin. */
  isHidden(id: string): boolean;
  setHidden(id: string, hidden: boolean): Promise<{ error: string | null }>;
  /** The id currently being written, so its control can show it is busy. */
  saving: string | null;
}

/**
 * Which clients an admin has hidden from the wall.
 *
 * ## Absence means visible
 *
 * The hook starts with an empty set and only ever *adds* hidden ids to it, so
 * every failure mode — the table not existing yet, RLS refusing the read, the
 * network being down, the fetch still in flight on first paint — lands on
 * "show everything the code lists". That is the safe direction for a marketing
 * page: the worst case is a client appearing that an admin meant to hide, which
 * is visible and fixable, rather than a blank wall that looks broken and tells
 * nobody why.
 *
 * It also means adding a client to `clients.ts` needs no database write before
 * it appears.
 *
 * ## Why this migration may not be applied
 *
 * `supabase/migrations/0005_client_visibility.sql` is committed but, like every
 * migration in this repo, is applied by hand. Until someone runs it the table
 * does not exist and the select below fails — which is exactly the case the
 * paragraph above is about. The read failure is logged at `warn` and otherwise
 * swallowed; a write failure is surfaced to the admin, because there the person
 * is waiting on an answer and silence would read as success.
 */
export function useClientVisibility(): ClientVisibilityApi {
  const [hidden, setHiddenSet] = useState<ReadonlySet<string>>(() => new Set());
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from(TABLE)
          .select('client_id, hidden')
          .returns<VisibilityRow[]>();

        if (cancelled) return;

        if (error) {
          console.warn('[clients] could not load client_visibility', error);
          return;
        }
        if (data) {
          setHiddenSet(new Set(data.filter((r) => r.hidden).map((r) => r.client_id)));
        }
      } catch (cause) {
        if (!cancelled) console.warn('[clients] could not load client_visibility', cause);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const isHidden = useCallback((id: string) => hidden.has(id), [hidden]);

  const setHidden = useCallback(
    async (id: string, next: boolean): Promise<{ error: string | null }> => {
      setSaving(id);
      try {
        const { error } = await supabase
          .from(TABLE)
          .upsert({ client_id: id, hidden: next }, { onConflict: 'client_id' });

        if (error) {
          console.warn('[clients] failed to save visibility', id, error);
          return { error: 'editError' };
        }

        // Applied locally so the wall answers immediately, with no refetch —
        // the same contract useContentEditor has for copy.
        setHiddenSet((prev) => {
          const set = new Set(prev);
          if (next) set.add(id);
          else set.delete(id);
          return set;
        });
        return { error: null };
      } catch (cause) {
        console.warn('[clients] failed to save visibility', id, cause);
        return { error: 'editError' };
      } finally {
        setSaving(null);
      }
    },
    [],
  );

  return { isHidden, setHidden, saving };
}
