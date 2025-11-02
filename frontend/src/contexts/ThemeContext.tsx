import { Theme } from '../types';
import { usePreferences } from './PreferencesContext';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

/**
 * Hook to access theme from preferences
 * Now uses PreferencesContext under the hood
 */
export const useTheme = (): ThemeContextType => {
  const { preferences, updatePreferences } = usePreferences();

  const setTheme = (theme: Theme) => {
    updatePreferences({ theme });
  };

  const toggleTheme = () => {
    const newTheme = preferences.theme === Theme.Modern ? Theme.Terminal : Theme.Modern;
    updatePreferences({ theme: newTheme });
  };

  return {
    theme: preferences.theme,
    setTheme,
    toggleTheme,
  };
};
