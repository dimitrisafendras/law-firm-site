import { useTranslation } from '@/i18n';
import { EditableSpawnText } from '@/components/animations/EditableSpawnText';
import { EditableText } from '@/components';
import { DigitalStatue } from '@/components/DigitalStatue/DigitalStatue';
import './HeroSection.css';

/*
 * Dust in a shaft of light — the classic look's answer to the circuit grid.
 *
 * Fourteen motes, hand-placed rather than generated: this component is
 * prerendered, so the server and the client must emit identical markup, and a
 * fixed list says that more plainly than a seeded generator would. They cluster
 * over the right two thirds, where the haze behind the statue puts the light;
 * nothing drifts through the copy column on the left.
 *
 * `r` is in user units, which is CSS pixels here — the layer's SVG carries no
 * viewBox, so nothing is scaled and a 1.4px mote is 1.4px on every screen.
 */
const CLASSIC_MOTES = [
  { cx: '41%', cy: '82%', r: 1.1 },
  { cx: '48%', cy: '64%', r: 1.6 },
  { cx: '53%', cy: '91%', r: 1.3 },
  { cx: '57%', cy: '38%', r: 1 },
  { cx: '61%', cy: '73%', r: 1.8 },
  { cx: '64%', cy: '22%', r: 1.2 },
  { cx: '68%', cy: '57%', r: 1.4 },
  { cx: '71%', cy: '86%', r: 1 },
  { cx: '74%', cy: '31%', r: 1.7 },
  { cx: '78%', cy: '68%', r: 1.2 },
  { cx: '82%', cy: '44%', r: 1.5 },
  { cx: '86%', cy: '79%', r: 1.1 },
  { cx: '89%', cy: '27%', r: 1.3 },
  { cx: '93%', cy: '59%', r: 1.6 },
];

export function HeroSection() {
  const { t } = useTranslation();

  const titleLine1 = t('heroTitleLine1');
  const titleLine2 = t('heroTitleLine2');

  return (
    <header className="hero-section">
      <div className="hero-section__bg">
        <DigitalStatue />
      </div>

      {/*
        The scrim. `.hero-section__bg-fade` has been fully specified in the
        stylesheet — including a four-stop mobile gradient — since the hero was
        written, and no element ever rendered it. That omission is why the
        mobile subtitle was capped at 40% width: with nothing darkening the
        statue there was no safe place for text to overlap it, so the copy was
        squeezed into a 150px column beside it instead.
      */}
      <div className="hero-section__bg-fade" aria-hidden="true" />

      {/* Digital circuit lines — traced in left→right, then junctions bloom */}
      <svg className="hero-section__lines" fill="none" aria-hidden="true">
        <g className="hero-section__lines-net">
          {/* Horizontal lines */}
          <line x1="0%" y1="15%" x2="75%" y2="15%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.15" />
          <line x1="12%" y1="30%" x2="94%" y2="30%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
          <line x1="6%" y1="50%" x2="100%" y2="50%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.08" />
          <line x1="25%" y1="70%" x2="88%" y2="70%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.12" />
          <line x1="0%" y1="85%" x2="81%" y2="85%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
          {/* Vertical lines */}
          <line x1="25%" y1="0%" x2="25%" y2="62%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.08" />
          <line x1="62%" y1="12%" x2="62%" y2="100%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
          <line x1="88%" y1="0%" x2="88%" y2="75%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.06" />
          {/* Diagonal connector lines */}
          <line x1="25%" y1="15%" x2="62%" y2="30%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
          <line x1="62%" y1="30%" x2="88%" y2="70%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.08" />
          <line x1="75%" y1="15%" x2="62%" y2="50%" stroke="var(--accent)" strokeWidth="0.5" opacity="0.06" />
        </g>

        {/* Junction circles — fixed px radius, never distorted */}
        <g className="hero-section__lines-nodes">
          <circle cx="25%" cy="15%" r="3" fill="var(--accent)" opacity="0.2" />
          <circle cx="62%" cy="30%" r="2.5" fill="var(--accent)" opacity="0.15" />
          <circle cx="75%" cy="15%" r="2" fill="var(--accent)" opacity="0.18" />
          <circle cx="88%" cy="70%" r="3" fill="var(--accent)" opacity="0.12" />
          <circle cx="25%" cy="50%" r="2" fill="var(--accent)" opacity="0.15" />
          <circle cx="62%" cy="85%" r="2.5" fill="var(--accent)" opacity="0.1" />
          <circle cx="44%" cy="15%" r="1.5" fill="var(--accent)" opacity="0.2" />
          <circle cx="81%" cy="30%" r="1.5" fill="var(--accent)" opacity="0.15" />
          <circle cx="50%" cy="70%" r="1.5" fill="var(--accent)" opacity="0.12" />
        </g>
      </svg>

      {/*
        The same beat in the classic look: no traces, no junctions — a shaft of
        warm light behind the figure with dust turning slowly in it. Both layers
        are always rendered and src/styles/classic.css decides which one paints,
        because the prerendered markup has to be mode-agnostic (see
        src/theme/modes.ts, and the long version in statueArtwork.ts).
      */}
      <div className="hero-section__classic" aria-hidden="true">
        <div className="hero-section__classic-haze" />
        <svg className="hero-section__classic-motes" fill="none" focusable="false">
          {CLASSIC_MOTES.map((mote) => (
            <circle key={mote.cx} cx={mote.cx} cy={mote.cy} r={mote.r} fill="currentColor" />
          ))}
        </svg>
      </div>

      <div className="hero-section__content">
        <span className="hero-section__badge">
          <span className="hero-section__badge-dot" aria-hidden="true" />
          <EditableText tKey="heroOverline" as="span" />
        </span>

        <h1 className="hero-section__title" aria-label={`${titleLine1} ${titleLine2}`}>
          {/* No `aria-hidden` on these wrappers: EditableSpawnText hides its own
              split, and hiding it out here would have hidden the *admin*
              rendering too — a contiguous, editable string that has to stay
              reachable. The h1's aria-label above is what AT announces. */}
          <span className="hero-section__title-line hero-section__title-line--1">
            <EditableSpawnText tKey="heroTitleLine1" />
          </span>
          <span className="hero-section__title-line hero-section__title-line--2">
            <EditableSpawnText tKey="heroTitleLine2" gradient />
          </span>
        </h1>

        {/* Word-level split stays readable to assistive tech as-is (unlike the
            per-character title, which is labelled on the <h1> instead). */}
        <p className="hero-section__subtitle">
          <EditableSpawnText tKey="heroSubtitle" mode="word" as="span" />
        </p>

        {/*
          The hero's one call to action, on the beat the stat card used to
          occupy. That card showed "30+ / YEARS COMBINED EXPERIENCE" and the
          stats band repeated it verbatim 300px below — at 1440x900 both were
          visible in a single viewport. The band owns the numbers now, and the
          only conversion element above the fold is no longer the nav pill.
        */}
        <div className="hero-section__actions">
          {/*
            * An anchor wearing the button's classes rather than a `<Button>`
            * with an onClick, and that is what makes the label editable: an
            * EditableText can BE an anchor (`as="a"`), but it cannot be the
            * inside of a `<button>` — a textarea may not nest there, and
            * `elementProps` takes strings, so the handler could not survive
            * the move either.
            *
            * Nothing is lost by dropping the handler. The root sets
            * `scroll-behavior: smooth`, so `#contact` scrolls exactly as
            * `scrollIntoView({ behavior: 'smooth' })` did, and every other
            * navigation on this page is already a plain hash anchor.
            */}
          <EditableText
            tKey="navCta"
            as="a"
            className="btn btn--primary btn--md"
            elementProps={{ href: '#contact' }}
          />
          {/* The arrow is a `::after` now, for the reason the detail pages'
              back links give: `as="a"` renders no children. */}
          <EditableText
            tKey="heroSecondaryCta"
            as="a"
            className="hero-section__secondary"
            elementProps={{ href: '#team' }}
          />
        </div>
      </div>

      <div className="hero-section__scroll-hint" aria-hidden="true">
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
          <path d="M1 1l9 9 9-9" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </header>
  );
}
