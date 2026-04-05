import './DigitalFlame.css';

interface DigitalFlameProps {
  className?: string;
}

export function DigitalFlame({ className = '' }: DigitalFlameProps) {
  return (
    <div className={`digital-flame ${className}`.trim()} aria-hidden="true">
      <div className="digital-flame__inner">
        <div className="digital-flame__layer digital-flame__layer--outer" />
        <div className="digital-flame__layer digital-flame__layer--mid" />
        <div className="digital-flame__layer digital-flame__layer--core" />
        <div className="digital-flame__spark" />
        <div className="digital-flame__spark" />
        <div className="digital-flame__spark" />
      </div>
    </div>
  );
}
