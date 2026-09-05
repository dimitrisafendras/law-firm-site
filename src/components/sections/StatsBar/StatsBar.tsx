import { useEffect, useRef, useState } from 'react';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { EditableText } from '@/components';
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
  labelKey: string;
  trigger: boolean;
  delay: number;
}

function StatItem({ value, suffix, labelKey, trigger, delay }: StatItemProps) {
  const count = useCountUp(value, 2000, trigger);

  return (
    <FadeInSection variant="fade-up" delay={delay} className="stats-bar__item">
      <span className="stats-bar__value">
        {count}{suffix}
      </span>
      <EditableText tKey={labelKey} as="span" className="stats-bar__label" />
    </FadeInSection>
  );
}

export function StatsBar() {
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
    { value: 500, suffix: '+', labelKey: 'statClients' },
    { value: 2, suffix: 'B+', labelKey: 'statTransactions' },
    { value: 30, suffix: '+', labelKey: 'statYears' },
    { value: 12, suffix: '', labelKey: 'statJurisdictions' },
  ];

  return (
    <div className="stats-bar" ref={ref}>
      <div className="stats-bar__inner">
        {stats.map((s, i) => (
          <StatItem key={s.labelKey} value={s.value} suffix={s.suffix} labelKey={s.labelKey} trigger={visible} delay={i * 0.1} />
        ))}
      </div>
    </div>
  );
}
