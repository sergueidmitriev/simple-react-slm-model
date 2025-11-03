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
  
  /** Model temperature parameter (0-2, higher = more creative) */
  temperature: number;
  
  /** Model top_p parameter (0-1, nucleus sampling) */
  topP: number;
  
  /** Model top_k parameter (1-100, limits token selection) */
  topK: number;
}

/**
 * Default preferences
 */
export const DEFAULT_PREFERENCES: Preferences = {
  language: Language.English,
  theme: Theme.Modern,
  streaming: false,
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
};
