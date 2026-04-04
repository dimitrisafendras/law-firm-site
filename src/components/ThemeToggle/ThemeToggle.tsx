import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setTheme } from '@/theme';
import { IconToggle } from '@/components/IconToggle/IconToggle';

type ThemeMode = 'system' | 'light' | 'dark';

export function ThemeToggle() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<ThemeMode>('system');

  function cycle() {
    const next: ThemeMode = mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system';
    setMode(next);
    setTheme(next);
  }

  const icon = mode === 'light' ? '\u2600' : mode === 'dark' ? '\u263E' : '\u25D0';
  const label = mode === 'system' ? t('themeSystem') : mode === 'light' ? t('themeLight') : t('themeDark');

  return (
    <IconToggle onClick={cycle} aria-label={t('themeLabel', { mode: label })}>
      {icon}
    </IconToggle>
  );
}
