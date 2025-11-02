import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="theme-toggle">
      <span className="text-xs">
        {t('theme.switchStyle')}
      </span>
      <button
        type="button"
        onClick={toggleTheme}
        className="theme-toggle-button"
      >
        <span className="theme-toggle-slider" />
      </button>
    </div>
  );
};

export default ThemeToggle;
