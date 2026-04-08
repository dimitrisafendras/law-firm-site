import './SectionHeader.css';

interface SectionHeaderProps {
  overline?: string;
  title: string;
  subtitle?: string;
  label?: string;
  align?: 'center' | 'left';
}

export function SectionHeader({
  overline,
  title,
  subtitle,
  label,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <div className={`section-header section-header--${align}`}>
      {overline && <span className="section-header__overline">{overline}</span>}

      <div className="section-header__row">
        <div className="section-header__text">
          <h2 className="section-header__title">{title}</h2>
          {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
        </div>

        {label && (
          <div className="section-header__label-col">
            <span className="section-header__divider" />
            <span className="section-header__label">{label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
