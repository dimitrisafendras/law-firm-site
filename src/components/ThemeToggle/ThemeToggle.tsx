import { useTranslation } from 'react-i18next';
import { IconToggle } from '@/components/IconToggle/IconToggle';

export function ThemeToggle() {
  const { t } = useTranslation();

  return (
    <IconToggle onClick={() => {}} aria-label={t('themeLabel', { mode: t('themeDark') })}>
      {'\u263E'}
    </IconToggle>
  );
}
