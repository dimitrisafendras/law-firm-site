import { useTranslation } from '@/i18n';
import { EditableSpawnText } from '@/components/animations/EditableSpawnText';
import { EditableText, Button } from '@/components';
import { DigitalStatue } from '@/components/DigitalStatue/DigitalStatue';
import './HeroSection.css';

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
          <Button
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {t('navCta')}
          </Button>
          <a className="hero-section__secondary" href="#team">
            {t('heroSecondaryCta')} <span aria-hidden="true">&darr;</span>
          </a>
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
