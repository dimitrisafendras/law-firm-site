import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ElementType,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { useTranslation } from '@/i18n';
import { useEditMode } from '@/lib/edit-mode';
import { useContentEditor } from '@/lib/content/useContentEditor';
import './EditableText.css';

interface EditableTextProps {
  tKey: string;
  as?: ElementType;
  className?: string;
  /**
   * Extra attributes for the rendered element — notably `href`, so a contact
   * link can be `<a href="mailto:…">` and still be editable.
   *
   * Without this, wiring the visible text of a link meant nesting a span inside
   * the anchor, which changes the visitor DOM. With it the anchor itself is the
   * rendered element and the markup is unchanged. Derive the href from the same
   * translation key as the text so editing the address updates both, rather
   * than leaving a link pointing at the old one.
   */
  elementProps?: Record<string, string | undefined>;
}

/** Interactive tags cannot legally contain a textarea, and an anchor would
 *  navigate on click instead of opening the editor. */
function isInteractive(tag: ElementType): boolean {
  return tag === 'a' || tag === 'button';
}

function autosize(el: HTMLTextAreaElement): void {
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}

export function EditableText({ tKey, as = 'span', className, elementProps }: EditableTextProps) {
  const { t, lang } = useTranslation();
  const { canEdit } = useEditMode();
  const { saveOverride, saving } = useContentEditor();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [failed, setFailed] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cancelledRef = useRef(false);

  const value = t(tKey);
  const Tag = as;

  const startEditing = useCallback(() => {
    cancelledRef.current = false;
    setDraft(value);
    setFailed(false);
    setEditing(true);
  }, [value]);

  const commit = useCallback(
    async (next: string) => {
      if (next === value) {
        setFailed(false);
        setEditing(false);
        return;
      }
      const { error } = await saveOverride(tKey, lang, next);
      if (error) {
        // Keep edit mode open so the typed text is not lost.
        setFailed(true);
        return;
      }
      setFailed(false);
      setEditing(false);
    },
    [lang, saveOverride, tKey, value],
  );

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    setDraft(value);
    setFailed(false);
    setEditing(false);
  }, [value]);

  useEffect(() => {
    if (!editing) return;
    const el = textareaRef.current;
    if (!el) return;
    autosize(el);
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [editing]);

  useEffect(() => {
    // A failed save re-enables the textarea — hand focus back so the typed
    // text can be corrected and retried without a second click.
    if (failed) textareaRef.current?.focus();
  }, [failed]);

  if (!canEdit) {
    return (
      <Tag className={className} {...elementProps}>
        {value}
      </Tag>
    );
  }

  const multiline = value.includes('\n');

  const handleDisplayKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    startEditing();
  };

  const handleEditKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancel();
      return;
    }
    if (event.key !== 'Enter') return;
    if (multiline && !event.metaKey && !event.ctrlKey) return;
    event.preventDefault();
    void commit(event.currentTarget.value);
  };

  const status = saving ? (
    <span className="editable-text__status">{t('editSaving')}</span>
  ) : failed ? (
    <span className="editable-text__error" role="alert">
      {t('editError')}
    </span>
  ) : null;

  const EditTag = isInteractive(Tag) ? 'span' : Tag;

  if (editing) {
    return (
      <EditTag className={`editable-text editable-text--editing ${className ?? ''}`.trim()}>
        <textarea
          ref={textareaRef}
          className="editable-text__input"
          value={draft}
          rows={1}
          disabled={saving}
          onChange={(event) => {
            setDraft(event.target.value);
            autosize(event.target);
          }}
          onKeyDown={handleEditKeyDown}
          onBlur={(event) => {
            if (cancelledRef.current || saving) return;
            void commit(event.target.value);
          }}
        />
        {status}
      </EditTag>
    );
  }

  return (
    <Tag
      className={`editable-text ${className ?? ''}`.trim()}
      {...elementProps}
      role="button"
      tabIndex={0}
      onClick={(event: ReactMouseEvent<HTMLElement>) => {
        event.preventDefault();
        startEditing();
      }}
      onKeyDown={handleDisplayKeyDown}
    >
      {value}
      {status}
    </Tag>
  );
}
