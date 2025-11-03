import { useTranslation } from 'react-i18next';
import { Language } from '../types';
import SettingGroup from './SettingGroup';

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
}

/**
 * Language selection dropdown for settings
 */
const LanguageSelector = ({ value, onChange }: LanguageSelectorProps) => {
  const { t } = useTranslation();

  return (
    <SettingGroup
      label={t('settings.language.label')}
      htmlFor="language-select"
    >
      <select
        id="language-select"
        value={value}
        onChange={(e) => onChange(e.target.value as Language)}
        className="setting-select"
      >
        <option value={Language.English}>
          {t('settings.language.english')}
        </option>
        <option value={Language.French}>
          {t('settings.language.french')}
        </option>
      </select>
    </SettingGroup>
  );
};

export default LanguageSelector;
