import { useTranslation } from 'react-i18next';
import { Theme } from '../types';
import SettingGroup from './SettingGroup';

interface ThemeSelectorProps {
  value: Theme;
  onChange: (theme: Theme) => void;
}

/**
 * Theme selection dropdown for settings
 */
const ThemeSelector = ({ value, onChange }: ThemeSelectorProps) => {
  const { t } = useTranslation();

  return (
    <SettingGroup
      label={t('settings.theme.label')}
      htmlFor="theme-select"
    >
      <select
        id="theme-select"
        value={value}
        onChange={(e) => onChange(e.target.value as Theme)}
        className="setting-select"
      >
        <option value={Theme.Modern}>
          {t('settings.theme.modern')}
        </option>
        <option value={Theme.Terminal}>
          {t('settings.theme.terminal')}
        </option>
      </select>
    </SettingGroup>
  );
};

export default ThemeSelector;
