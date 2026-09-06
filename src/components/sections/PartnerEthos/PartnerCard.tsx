import { useTranslation } from '@/i18n';
import { useEditMode } from '@/lib/edit-mode';
import { EditableText } from '@/components';
import { partnerHref } from './partners';
import type { Partner } from './partners';
import './PartnerEthos.css';

interface PartnerCardProps {
  partner: Partner;
  /** Heading level for the name. `h3` inside the team section's `h2`. */
  headingLevel?: 'h2' | 'h3';
}

/**
 * One partner, as a card that is entirely a link to their detail page.
 *
 * The link is the name, in the heading — not a separate "read more" control and
 * not a click handler on the `<article>`. A stretched `::after` on that anchor
 * covers the card, so the whole surface is the target while the accessible name
 * stays the partner's name and no interactive element is nested inside another.
 * The "view profile" row underneath is `aria-hidden`: it is the visible
 * affordance for the link the heading already carries, not a second one.
 *
 * `.glass` spends both of the card's own pseudo-elements on the material's
 * illumination and highlight layers, which is why everything sits inside
 * `__body` — a single positioned child that fills the card and becomes the
 * containing block the stretched `::after` needs.
 *
 * Admin edit mode is the one case with no link. `EditableText` turns its
 * element into a `role="button"` editor, and an editor inside an anchor is both
 * nested interactive content and a click the two would have to fight over. An
 * admin editing copy is not navigating, so the card simply stops being a link
 * until edit mode is switched off.
 */
export function PartnerCard({ partner, headingLevel: Heading = 'h3' }: PartnerCardProps) {
  const { n, avif, fallback } = partner;
  const { t } = useTranslation();
  const { canEdit } = useEditMode();

  const linked = !canEdit;

  const classes = [
    'partner-ethos__bust',
    'glass',
    linked ? 'partner-ethos__bust--linked glass--interactive' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={classes}>
      <div className="partner-ethos__body">
        <div className="partner-ethos__portrait">
          <picture>
            <source type="image/avif" srcSet={avif} />
            <img
              src={fallback}
              alt={t(`attorney${n}Name`)}
              className="partner-ethos__image"
              width={512}
              height={640}
              loading="lazy"
              decoding="async"
            />
          </picture>
          <EditableText tKey={`attorney${n}Title`} as="span" className="partner-ethos__badge" />
        </div>

        {linked ? (
          <Heading className="partner-ethos__name">
            <a className="partner-ethos__link" href={partnerHref(n)}>
              {t(`attorney${n}Name`)}
            </a>
          </Heading>
        ) : (
          <EditableText tKey={`attorney${n}Name`} as={Heading} className="partner-ethos__name" />
        )}

        <p className="partner-ethos__role">
          <EditableText tKey={`attorney${n}Spec1`} as="span" /> &amp;{' '}
          <EditableText tKey={`attorney${n}Spec2`} as="span" />
        </p>
        <div className="partner-ethos__bio">
          <EditableText tKey={`attorney${n}Bio`} as="p" />
        </div>

        <dl className="partner-ethos__meta">
          <div className="partner-ethos__meta-item">
            <EditableText tKey="teamFocusLabel" as="dt" className="partner-ethos__meta-label" />
            <EditableText tKey={`attorney${n}Focus`} as="dd" className="partner-ethos__meta-value" />
          </div>
          <div className="partner-ethos__meta-item">
            <EditableText tKey="teamOriginLabel" as="dt" className="partner-ethos__meta-label" />
            <EditableText
              tKey={`attorney${n}Origin`}
              as="dd"
              className="partner-ethos__meta-value"
            />
          </div>
        </dl>

        {linked && (
          <span className="partner-ethos__cue" aria-hidden="true">
            {t('teamViewProfile')}
            <span className="partner-ethos__cue-arrow">&#8594;</span>
          </span>
        )}
      </div>
    </article>
  );
}
