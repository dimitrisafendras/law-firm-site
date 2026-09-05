import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/i18n';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { EditableText } from '@/components';
import './StatsBar.css';

function useCountUp(target: number, duration = 2000, trigger: boolean) {
  const [count, setCount] = useState(0);
  /* The figure animates once per value. Pinning the ref to the target it ran
     for keeps re-renders from restarting it, while still re-running when the
     figure itself changes — an admin edit or a locale switch would otherwise
     leave the old number frozen next to the new suffix. */
  const ranFor = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger || ranFor.current === target) return;
    ranFor.current = target;

    const start = performance.now();
    let frame = requestAnimationFrame(function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [trigger, target, duration]);

  return count;
}

/**
 * Splits a translated figure such as '500+', '2B+' or '12' into the number the
 * counter animates towards and the literal that trails it. A value that does
 * not open with digits has nothing to count, so `target` comes back null and
 * the whole string is printed verbatim — an edited figure never shows a stray 0.
 */
function splitStatValue(raw: string): { target: number | null; suffix: string } {
  const match = /^(\d+)([\s\S]*)$/.exec(raw);
  if (!match) return { target: null, suffix: raw };
  return { target: Number(match[1]), suffix: match[2] };
}

interface StatItemProps {
  valueKey: string;
  labelKey: string;
  trigger: boolean;
  delay: number;
}

function StatItem({ valueKey, labelKey, trigger, delay }: StatItemProps) {
  const { t } = useTranslation();
  const { target, suffix } = splitStatValue(t(valueKey));
  const count = useCountUp(target ?? 0, 2000, trigger);

  return (
    <FadeInSection variant="fade-up" delay={delay} className="stats-bar__item">
      <span className="stats-bar__value">
        {target === null ? '' : count}{suffix}
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
    { valueKey: 'statClientsValue', labelKey: 'statClients' },
    { valueKey: 'statTransactionsValue', labelKey: 'statTransactions' },
    { valueKey: 'statYearsValue', labelKey: 'statYears' },
    { valueKey: 'statJurisdictionsValue', labelKey: 'statJurisdictions' },
  ];

  return (
    <div className="stats-bar" ref={ref}>
      <div className="stats-bar__inner">
        {stats.map((s, i) => (
          <StatItem key={s.labelKey} valueKey={s.valueKey} labelKey={s.labelKey} trigger={visible} delay={i * 0.1} />
        ))}
      </div>
    </div>
  );
}
