import { Preferences, DEFAULT_PREFERENCES } from '../types/preferences';
import { Language } from '../types/language';
import { Theme } from '../types/theme';

const PREFERENCES_KEY = 'slm-chat-preferences';

/**
 * Save preferences to localStorage
 */
export const savePreferences = (preferences: Preferences): void => {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences to localStorage:', error);
  }
};

/**
 * Load preferences from localStorage
 * Returns default preferences if not found or invalid
 */
export const loadPreferences = (): Preferences => {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (!stored) {
      return { ...DEFAULT_PREFERENCES };
    }

    const parsed = JSON.parse(stored);
    
    // Validate and merge with defaults to handle missing fields
    return {
      language: isValidLanguage(parsed.language) ? parsed.language : DEFAULT_PREFERENCES.language,
      theme: isValidTheme(parsed.theme) ? parsed.theme : DEFAULT_PREFERENCES.theme,
      streaming: typeof parsed.streaming === 'boolean' ? parsed.streaming : DEFAULT_PREFERENCES.streaming,
    };
  } catch (error) {
    console.error('Failed to load preferences from localStorage:', error);
    return { ...DEFAULT_PREFERENCES };
  }
};

/**
 * Clear preferences from localStorage
 */
export const clearPreferences = (): void => {
  try {
    localStorage.removeItem(PREFERENCES_KEY);
  } catch (error) {
    console.error('Failed to clear preferences from localStorage:', error);
  }
};

// Validation helpers
function isValidLanguage(value: unknown): value is Language {
  return Object.values(Language).includes(value as Language);
}

function isValidTheme(value: unknown): value is Theme {
  return Object.values(Theme).includes(value as Theme);
}
