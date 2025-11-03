import { useTranslation, UseTranslationResponse } from 'react-i18next';
import { usePreferences } from '../contexts/PreferencesContext';
import { Theme } from '../types';

interface UseThemedTranslationReturn {
  /** Theme-aware translation function that automatically appends 'Terminal' suffix in Terminal theme */
  tt: (key: string) => string;
  /** Standard i18next translation function */
  t: UseTranslationResponse<'translation', undefined>['t'];
  /** i18next instance */
  i18n: UseTranslationResponse<'translation', undefined>['i18n'];
  /** Current theme */
  theme: Theme;
}

/**
 * Hook that provides theme-aware translations
 * Automatically uses Terminal-specific translation keys when in terminal theme
 * 
 * @example
 * const { tt } = useThemedTranslation();
 * // In Modern theme: tt('chat.title') -> returns 'Chat'
 * // In Terminal theme: tt('chat.title') -> returns 'CHAT.EXE'
 */
export const useThemedTranslation = (): UseThemedTranslationReturn => {
  const { t, i18n } = useTranslation();
  const { preferences } = usePreferences();

  /**
   * Get translation with automatic theme variant handling
   * Appends 'Terminal' suffix to key when in Terminal theme
   * Falls back to base key if Terminal variant doesn't exist
   * 
   * @param key - Base translation key (e.g., 'chat.title')
   * @returns Translated string for current theme
   */
  const tt = (key: string): string => {
    if (preferences.theme === Theme.Terminal) {
      // Try the Terminal-specific key first
      const terminalKey = `${key}Terminal`;
      const terminalValue = t(terminalKey);
      
      // If Terminal key exists and is different from key itself (not found), use it
      if (terminalValue !== terminalKey) {
        return terminalValue;
      }
    }
    
    // Fall back to base key
    return t(key);
  };

  return { 
    tt, 
    t, 
    i18n,
    theme: preferences.theme,
  };
};
