import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FadeInSection } from '@/components/animations/FadeInSection';
import './StatsBar.css';

function useCountUp(target: number, duration = 2000, trigger: boolean) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!trigger || hasRun.current) return;
    hasRun.current = true;

    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);

  return count;
}

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  trigger: boolean;
  delay: number;
}

function StatItem({ value, suffix, label, trigger, delay }: StatItemProps) {
  const count = useCountUp(value, 2000, trigger);

  return (
    <FadeInSection variant="fade-up" delay={delay} className="stats-bar__item">
      <span className="stats-bar__value">
        {count}{suffix}
      </span>
      <span className="stats-bar__label">{label}</span>
    </FadeInSection>
  );
}

export function StatsBar() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { value: 500, suffix: '+', label: t('statClients') },
    { value: 2, suffix: 'B+', label: t('statTransactions') },
    { value: 30, suffix: '+', label: t('statYears') },
    { value: 12, suffix: '', label: t('statJurisdictions') },
  ];

  return (
    <div className="stats-bar" ref={ref}>
      <div className="stats-bar__inner">
        {stats.map((s, i) => (
          <StatItem key={s.label} value={s.value} suffix={s.suffix} label={s.label} trigger={visible} delay={i * 0.1} />
        ))}
      </div>
    </div>
  );
}
