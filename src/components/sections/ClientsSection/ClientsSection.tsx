import { useState, type CSSProperties } from 'react';
import { useTranslation } from '@/i18n';
import { useEditMode } from '@/lib/edit-mode';
import { Card } from '@/components';
import { FadeInSection, StaggerGroup } from '@/components/animations/FadeInSection';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { clients } from './clients';
import { useClientVisibility } from './useClientVisibility';
import './ClientsSection.css';

/**
 * The clients wall — eight glass cards, each a link to that client's own site.
 *
 * ## Why the logos are monochrome
 *
 * Not a style preference. The eight files arrived from eight different sites in
 * eight different states, and measured (see scripts/prepare-client-logos.mjs
 * for the table): two were fully opaque rectangles that paint as slabs, three
 * are near-white artwork drawn for a dark header, three are near-black artwork
 * drawn for a light one. This site wears nine light palettes and nine dark
 * ones, plus the derived rungs between them, so for any fixed presentation in
 * the original colours there is a ground that kills at least three of them —
 * white-on-white or black-on-black, with no styling available to rescue it,
 * because the ink is baked into the file.
 *
 * Supplying a light and a dark variant of each does not fix it either. Only
 * some of these brands publish both, the ladder's middle rungs are neither, and
 * it would make the wall's legibility depend on which of eighteen palettes the
 * reader happens to have chosen. One silhouette per client, tinted from a token,
 * is correct everywhere by construction.
 *
 * ## Why a mask and not a filter
 *
 * The site already tints flat black artwork with a scheme-dependent filter —
 * `#social .button-icon` flips between `invert(1) brightness(2)` and `none`,
 * generated per light palette. That mechanism is keyed on the PALETTE ID, and
 * it would be wrong here: a light palette dragged down the contrast ladder to
 * step 2 still matches `:root[data-theme='papyrus']`, so it would keep the
 * light-palette branch and paint black logos on a ground that is no longer
 * light.
 *
 * `mask-image` plus `background-color` has no such table to get out of step
 * with. It resolves whatever the token resolves to, on every palette, every
 * look and every rung, including rungs that do not exist yet. The ink follows
 * the theme rather than a list of the theme's names.
 *
 * The mask URL arrives as an inline custom property because the file names are
 * Vite-hashed build outputs that a stylesheet cannot know. This does not
 * reintroduce the hydration hazard the statue background has: the value depends
 * only on WHICH CLIENT this is, never on the palette, so server and client
 * always produce the same string.
 *
 * ## Why the name is set rather than left to the mark
 *
 * Several of these marks do not say who they are. PSI's is an abstract
 * monogram with no wordmark in it at all, and Develor's wordmark is the group
 * name with no country on it. The name line is therefore real copy in the
 * card, not a caption on a picture — it is the link's accessible name, it is
 * translatable, and it is the only thing that identifies half this wall to a
 * reader who does not already know the brand.
 */
export function ClientsSection() {
  const { t } = useTranslation();
  const { canEdit } = useEditMode();
  const { isHidden, setHidden, saving } = useClientVisibility();

  /*
   * The id whose last write failed, so its card can say so.
   *
   * useClientVisibility documents that a write failure is surfaced to the admin
   * — the person is waiting on an answer and silence reads as success — but the
   * result was discarded here, so a failed toggle did nothing and said nothing.
   * With the table missing (migration 0005 unapplied) that is every toggle, and
   * it is exactly what 'the hide button is broken' looks like from the outside.
   *
   * One id rather than a set: the admin is clicking one card at a time, and a
   * retry that succeeds should clear the message it replaced.
   */
  const [failed, setFailed] = useState<string | null>(null);

  const toggle = async (id: string, next: boolean) => {
    const { error } = await setHidden(id, next);
    if (error) setFailed(id);
    else setFailed((prev) => (prev === id ? null : prev));
  };

  /*
   * An admin in edit mode sees the whole roster, hidden ones included and
   * marked; everyone else sees only what is visible. Filtered here rather than
   * inside the map so the grid's child count stays honest — `StaggerGroup`
   * indexes its children to stagger their entrances.
   */
  const shown = canEdit ? clients : clients.filter((client) => !isHidden(client.id));

  return (
    <section id="clients" className="clients-section">
      <div className="clients-section__inner">
        <FadeInSection>
          <SectionHeader
            titleKey="clientsTitle"
            subtitleKey="clientsSubtitle"
            labelKey="chapterClients"
          />
        </FadeInSection>

        <StaggerGroup className="clients-wall">
          {shown.map((client) => (
            /* Card inside the fade wrapper rather than on it, matching the
               practice grid: the wrapper owns the entrance, the card owns its
               hover transition. */
            <FadeInSection key={client.id}>
              {/*
                `glass--matte` for the reason Card.tsx documents: this section
                carries `content-visibility: auto`, which makes it a backdrop
                root with nothing behind it, so a lensing card here would sample
                empty space and paint a flat tint anyway. Matte says so on
                purpose instead of arriving there by accident.
              */}
              <Card
                as="article"
                interactive={!canEdit}
                className={`client-card glass--matte ${
                  canEdit && isHidden(client.id) ? 'client-card--hidden' : ''
                }`.trim()}
              >
                <span
                  className="client-card__logo"
                  style={{ '--client-logo': `url(${client.logo.src})` } as CSSProperties}
                />
                {/*
                  The name is the heading and the heading carries the link, so
                  the accessible name is the client's name. A stretched
                  `::after` on the anchor then covers the whole card — see the
                  twin on PracticeDomainCard, including why the heading has to
                  be put back to `position: static` for that to resolve against
                  the card rather than against two words of name.
                */}
                <h3 className="client-card__name">
                  {canEdit ? (
                    /*
                     * No link in edit mode. The card's click target is a
                     * stretched `::after` covering the whole surface, so a
                     * toggle inside it would be a control nested in a link,
                     * with two handlers fighting over one click — the same
                     * reason PracticeDomainCard drops its link while an admin
                     * is editing. An admin managing the wall is not browsing it.
                     */
                    t(client.nameKey)
                  ) : (
                    <a
                      className="client-card__link"
                      href={client.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t(client.nameKey)}
                      {/* Part of the link's name rather than a `title`, which is
                          not announced reliably and is unreachable by touch. */}
                      <span className="visually-hidden"> {t('clientsOpensInNewTab')}</span>
                    </a>
                  )}
                </h3>

                {canEdit && (
                  /*
                   * `aria-pressed` rather than a checkbox: this is one button
                   * whose effect toggles, and its label says which way it will
                   * go.
                   *
                   * The visible word is just "Hide" / "Show" because the card is
                   * small, but the accessible name names the client — a wall of
                   * eight buttons all reading "Hide" is unusable from a screen
                   * reader's element list or by voice. `aria-label` overrides
                   * the text rather than adding to it, so the two never
                   * double up.
                   */
                  <button
                    type="button"
                    className="client-card__visibility"
                    aria-pressed={isHidden(client.id)}
                    aria-label={t(isHidden(client.id) ? 'clientShowLabel' : 'clientHideLabel', {
                      name: t(client.nameKey),
                    })}
                    disabled={saving === client.id}
                    onClick={() => void toggle(client.id, !isHidden(client.id))}
                  >
                    {t(isHidden(client.id) ? 'clientShow' : 'clientHide')}
                  </button>
                )}

                {canEdit && failed === client.id && (
                  /*
                   * `role="alert"` and the shared `editError` string, the same
                   * contract EditableText has for a save that did not land.
                   *
                   * In flow rather than absolutely positioned: the wall is
                   * `grid-auto-rows: 1fr`, so this line grows every card by the
                   * same amount and the set stays equal-height.
                   */
                  <span className="client-card__error" role="alert">
                    {t('editError')}
                  </span>
                )}
              </Card>
            </FadeInSection>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
