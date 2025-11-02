import { Theme } from '../types';

/**
 * Utility function to get theme-specific classes
 * Reduces repeated conditional logic throughout components
 */
export const getThemeClasses = (
  theme: Theme,
  styles: { modern: string; terminal: string }
): string => {
  return theme === Theme.Terminal ? styles.terminal : styles.modern;
};

/**
 * Check if current theme is terminal
 */
export const isTerminal = (theme: Theme): boolean => {
  return theme === Theme.Terminal;
};

/**
 * Combine multiple theme-aware class strings
 */
export const cn = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
