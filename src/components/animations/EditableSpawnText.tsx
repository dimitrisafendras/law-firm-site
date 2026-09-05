import type { ElementType } from 'react';
import { useTranslation } from '@/i18n';
import { useEditMode } from '@/lib/edit-mode';
import { EditableText } from '@/components/EditableText';
import { SpawnText, type SpawnMode } from './SpawnText';

interface EditableSpawnTextProps {
  tKey: string;
  mode?: SpawnMode;
  gradient?: boolean;
  /** Element used for the admin (editable) rendering. */
  as?: ElementType;
  className?: string;
}

/**
 * Hero copy that animates for visitors and is editable for admins.
 *
 * SpawnText splits a string into one span per character or word to drive the
 * entrance animation. EditableText needs a single contiguous text node to edit.
 * The two cannot wrap each other, which is why the hero title and subtitle were
 * the only site copy an admin could not change.
 *
 * Resolving it by viewer rather than by markup: a visitor gets SpawnText exactly
 * as before — byte-identical DOM, animation untouched — and an admin gets a
 * plain editable string. The admin trades the entrance animation for the
 * ability to edit, which is the right way round: the animation plays once on
 * load, editing is the reason they are signed in.
 */
export function EditableSpawnText({
  tKey,
  mode = 'char',
  gradient = false,
  as = 'span',
  className,
}: EditableSpawnTextProps) {
  const { t } = useTranslation();
  const { canEdit } = useEditMode();

  if (canEdit) {
    return <EditableText tKey={tKey} as={as} className={className} />;
  }

  return <SpawnText text={t(tKey)} mode={mode} gradient={gradient} className={className} />;
}
