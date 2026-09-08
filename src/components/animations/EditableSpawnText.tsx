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

  // The admin rendering is a real, contiguous, editable string — it must stay
  // reachable by assistive tech, so it is never hidden. Callers therefore cannot
  // put `aria-hidden` on a wrapper around this component: that would hide the
  // editable text too. Hiding belongs here, on the branch that is actually
  // decorative.
  if (canEdit) {
    return <EditableText tKey={tKey} as={as} className={className} />;
  }

  /*
   * Decorative split plus a real, hidden copy of the string.
   *
   * The split itself must be `aria-hidden`: it is one inline-block box per
   * character or word, and a browser inserts a separator between non-inline
   * boxes when it computes an accessible name, so an exposed split announces
   * as "O u r  E x p e r t i s e".
   *
   * Hiding it leaves the element with no text at all, so something has to carry
   * the string. That used to be an `aria-label` on the owning element at each
   * call site — which is valid on the hero's `h1` and SectionHeader's `h2`
   * (headings support naming from author) and PROHIBITED on SectionHeader's
   * `p` and the testimonial `blockquote`, whose roles do not. On those two the
   * label was being dropped, so four section subtitles and the rotating quote
   * were reaching screen readers completely empty.
   *
   * A visually-hidden text node has no role restrictions and works the same in
   * all four places, so the label lives here now and no call site carries one.
   */
  return (
    <>
      <span className="visually-hidden">{t(tKey)}</span>
      <SpawnText text={t(tKey)} mode={mode} gradient={gradient} className={className} ariaHidden />
    </>
  );
}
