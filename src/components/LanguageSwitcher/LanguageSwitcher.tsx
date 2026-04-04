import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggle = () => {
    const next = i18n.language === 'en' ? 'el' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };

  return (
    <button className="lang-switcher" onClick={toggle} aria-label="Switch language">
      {i18n.language === 'en' ? 'ΕΛ' : 'EN'}
    </button>
  );
}
