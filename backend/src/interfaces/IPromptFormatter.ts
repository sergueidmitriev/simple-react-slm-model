/**
 * Interface for formatting prompts with language/context
 */
export interface IPromptFormatter {
  /**
   * Format a user message with appropriate context/hints
   * @param message - Raw user message
   * @param language - Target language
   * @returns Formatted prompt ready for model
   */
  format(message: string, language?: string): string;
}
