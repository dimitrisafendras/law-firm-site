import { EditableText } from '../EditableText';
import { EditableSpawnText } from '../animations/EditableSpawnText';
import './SectionHeader.css';

interface SectionHeaderProps {
  overline?: string;
  title?: string;
  subtitle?: string;
  label?: string;
  align?: 'center' | 'left';
  /**
   * Translation-key variants. Pass these instead of the resolved strings to make
   * the copy editable in place by an admin.
   *
   * EditableText renders exactly `<As className={...}>{t(key)}</As>` for a
   * visitor, so each *Key prop produces byte-identical markup to its string
   * counterpart — same element, same class, same position. The string props stay
   * for callers that pass literals rather than translations (the design system
   * showcase), so nothing has to change all at once.
   */
  overlineKey?: string;
  titleKey?: string;
  subtitleKey?: string;
  labelKey?: string;
}

export function SectionHeader({
  overline,
  title,
  subtitle,
  label,
  align = 'left',
  overlineKey,
  titleKey,
  subtitleKey,
  labelKey,
}: SectionHeaderProps) {
  return (
    <div className={`section-header section-header--${align}`}>
      {overlineKey ? (
        <EditableText tKey={overlineKey} as="span" className="section-header__overline" />
      ) : (
        overline && <span className="section-header__overline">{overline}</span>
      )}

      <div className="section-header__row">
        <div className="section-header__text">
          {/*
            The <h2> stays a real <h2> for everyone. SpawnText's root is a
            <span>, so the split has to live *inside* the heading rather than
            replace it — otherwise visitors get a span where the document
            outline expects a heading, while admins get the h2.

            The spawn itself is the hero's signature motion, extended down the
            page: it was the one piece of choreography on the site that could
            not belong to anything else, and below the fold everything was a
            generic fade. Scroll-linked here rather than delay-driven, so it
            plays when the title is reached instead of on page load.

            No `aria-label` here. The split's inline-block boxes would
            otherwise be read out letter by letter ("O u r  E x p e r t i s e"),
            so EditableSpawnText hides them and emits a visually-hidden copy of
            the real string alongside. That copy is what names the heading and
            what the subtitle announces.

            It used to be an `aria-label` on each of these two elements. On the
            `h2` that was valid; on the `p` below it was not — ARIA prohibits
            naming a paragraph, so the label was dropped and the subtitle
            reached screen readers empty.
          */}
          {titleKey ? (
            <h2 className="section-header__title">
              <EditableSpawnText tKey={titleKey} className="spawn-text--scroll" />
            </h2>
          ) : (
            <h2 className="section-header__title">{title}</h2>
          )}

          {subtitleKey ? (
            <p className="section-header__subtitle">
              <EditableSpawnText tKey={subtitleKey} mode="word" className="spawn-text--scroll" />
            </p>
          ) : (
            subtitle && <p className="section-header__subtitle">{subtitle}</p>
          )}
        </div>

        {(labelKey || label) && (
          <div className="section-header__label-col">
            <span className="section-header__divider" />
            {labelKey ? (
              <EditableText tKey={labelKey} as="span" className="section-header__label" />
            ) : (
              <span className="section-header__label">{label}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
