import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="toggle-switch-container">
      <span className="toggle-title">{t('theme.title')}:</span>
      <div className="toggle-switch-wrapper">
        <span className="toggle-label-left">{t('theme.modern')}</span>
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-button"
        >
          <span className={`theme-toggle-slider ${theme === Theme.Terminal ? 'active' : ''}`} />
        </button>
        <span className="toggle-label-right">{t('theme.terminal')}</span>
      </div>
    </div>
  );
};

export default ThemeToggle;
