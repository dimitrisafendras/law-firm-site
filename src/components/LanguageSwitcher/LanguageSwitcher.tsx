import { useTranslation } from '@/i18n';
import { IconToggle } from '@/components/IconToggle/IconToggle';

export default function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  const toggle = () => {
    setLang(lang === 'en' ? 'el' : 'en');
  };

  return (
    <IconToggle
      onClick={toggle}
      aria-label={lang === 'en' ? 'EL — Switch to Greek' : 'EN — Switch to English'}
    >
      {lang === 'en' ? 'EL' : 'EN'}
    </IconToggle>
  );
}
