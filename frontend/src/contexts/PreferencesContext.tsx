import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Preferences } from '../types/preferences';
import { loadPreferences, savePreferences } from '../utils/preferences';

interface PreferencesContextValue {
  preferences: Preferences;
  updatePreferences: (updates: Partial<Preferences>) => void;
  resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

interface PreferencesProviderProps {
  children: React.ReactNode;
}

/**
 * Provider for user preferences with localStorage persistence
 */
export const PreferencesProvider = ({ children }: PreferencesProviderProps) => {
  // Load preferences from localStorage on mount
  const [preferences, setPreferences] = useState<Preferences>(() => loadPreferences());

  // Save to localStorage whenever preferences change
  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  // Apply theme to document root whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', preferences.theme);
  }, [preferences.theme]);

  /**
   * Update one or more preference values
   */
  const updatePreferences = useCallback((updates: Partial<Preferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  /**
   * Reset preferences to defaults
   */
  const resetPreferences = useCallback(() => {
    const defaults = loadPreferences();
    setPreferences(defaults);
  }, []);

  const value: PreferencesContextValue = {
    preferences,
    updatePreferences,
    resetPreferences,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

/**
 * Hook to access preferences context
 * @throws Error if used outside PreferencesProvider
 */
export const usePreferences = (): PreferencesContextValue => {
  const context = useContext(PreferencesContext);
  
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  
  return context;
};
