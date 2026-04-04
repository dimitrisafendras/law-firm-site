import { useTranslation } from 'react-i18next';
import { IconToggle } from '@/components/IconToggle/IconToggle';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggle = () => {
    const next = i18n.language === 'en' ? 'el' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };

  return (
    <IconToggle
      onClick={toggle}
      aria-label={i18n.language === 'en' ? 'EL — Switch to Greek' : 'EN — Switch to English'}
    >
      {i18n.language === 'en' ? 'EL' : 'EN'}
    </IconToggle>
  );
}
