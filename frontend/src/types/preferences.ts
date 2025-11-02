import { Language } from './language';
import { Theme } from './theme';

/**
 * User preferences that persist across sessions
 */
export interface Preferences {
  /** UI language */
  language: Language;
  
  /** UI theme style */
  theme: Theme;
  
  /** Enable streaming responses */
  streaming: boolean;
}

/**
 * Default preferences
 */
export const DEFAULT_PREFERENCES: Preferences = {
  language: Language.English,
  theme: Theme.Modern,
  streaming: false,
};
