import { useTranslation } from 'react-i18next';
import { usePreferences } from '../contexts/PreferencesContext';
import { Language } from '../types';

const LanguageToggle = () => {
  const { t } = useTranslation();
  const { preferences, updatePreferences } = usePreferences();

  const toggleLanguage = () => {
    const newLang = preferences.language === Language.English ? Language.French : Language.English;
    updatePreferences({ language: newLang });
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
        title={preferences.language === Language.English ? t('language.french') : t('language.english')}
      >
        <span className="language-toggle-flag">
          {preferences.language === Language.English ? '🇬🇧' : '🇫🇷'}
        </span>
      </button>
    </div>
  );
};

export default LanguageToggle;
