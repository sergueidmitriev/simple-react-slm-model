import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle: React.FC = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <div className="language-toggle">
      <span className="text-xs">
        {t('language.switch')}
      </span>
      <button
        type="button"
        onClick={toggleLanguage}
        className="language-toggle-button"
        title={i18n.language === 'en' ? t('language.french') : t('language.english')}
      >
        <span className="language-toggle-flag">
          {i18n.language === 'en' ? '🇬🇧' : '🇫🇷'}
        </span>
      </button>
    </div>
  );
};

export default LanguageToggle;
