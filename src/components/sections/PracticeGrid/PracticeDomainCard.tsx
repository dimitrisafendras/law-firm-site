import { useTranslation } from '@/i18n';
import { useEditMode } from '@/lib/edit-mode';
import { Card, EditableText } from '@/components';
import { practiceHref } from './practiceAreas';
import type { PracticeArea } from './practiceAreas';
import './PracticeGrid.css';

interface PracticeDomainCardProps {
  area: PracticeArea;
  /** Heading level for the title. `h3` inside the practice section's `h2`. */
  headingLevel?: 'h2' | 'h3';
}

/**
 * One practice area, as a card that is entirely a link to its detail page.
 *
 * The link is the domain title, in the heading — not the "explore domain" row
 * that used to carry it. A stretched `::after` on that anchor covers the card,
 * so the whole surface is the target while the accessible name stays the
 * domain's name and no interactive element is nested inside another. The
 * explore row underneath is now an `aria-hidden` span: it is the visible
 * affordance for the link the heading already carries, not a second one.
 *
 * This card used to inline the glass material by hand rather than take it from
 * `<Card>`, because `.glass` sets `position: relative` on its direct children:
 * that would have knocked the absolutely-positioned illustration out of place
 * and made the `<h3>` the anchor's containing block, shrinking the target to
 * the title. It needs no `__body` wrapper to escape that — unlike `PartnerCard`
 * only two children care, so PracticeGrid.css puts those two back
 * (`__bg` to absolute, `__title` to static) and everything else keeps the
 * promotion. `inset: 0` on the stretched link then resolves to the card.
 *
 * Admin edit mode is the one case with no link. `EditableText` turns its
 * element into a `role="button"` editor, and an editor inside an anchor is both
 * nested interactive content and a click the two would have to fight over. An
 * admin editing copy is not navigating, so the card simply stops being a link
 * until edit mode is switched off.
 */
export function PracticeDomainCard({
  area,
  headingLevel: Heading = 'h3',
}: PracticeDomainCardProps) {
  const { key, slug, bg: Bg, num } = area;
  const { t } = useTranslation();
  const { canEdit } = useEditMode();

  const linked = !canEdit;

  const classes = ['practice-domain', linked ? 'practice-domain--linked' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <Card as="article" interactive={linked} className={classes}>
      <Bg className="practice-domain__bg" />
      <span className="practice-domain__num">{t('practiceDomainNum', { num })}</span>

      {linked ? (
        <Heading className="practice-domain__title">
          <a className="practice-domain__link" href={practiceHref(slug)}>
            {t(`practice${key}Title`)}
          </a>
        </Heading>
      ) : (
        <EditableText tKey={`practice${key}Title`} as={Heading} className="practice-domain__title" />
      )}

      <EditableText tKey={`practice${key}Desc`} as="p" className="practice-domain__desc" />

      {linked && (
        <span className="practice-domain__cue" aria-hidden="true">
          {t('practiceExploreDomain')}
          <span className="practice-domain__cue-arrow">&rarr;</span>
        </span>
      )}
    </Card>
  );
}
