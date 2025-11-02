import { IPromptFormatter } from '../interfaces/IPromptFormatter';

/**
 * Formats prompts with bilingual language hints
 */
export class BilingualPromptFormatter implements IPromptFormatter {
  private readonly languageInstructions: Map<string, string>;

  constructor() {
    this.languageInstructions = new Map([
      ['en', 'Answer in English to the following question:'],
      ['fr', 'Réponds en français à la question suivante:'],
      ['es', 'Responde en español a la siguiente pregunta:'],
      ['de', 'Antworte auf Deutsch auf die folgende Frage:'],
    ]);
  }

  public format(message: string, language?: string): string {
    if (!language || !this.languageInstructions.has(language)) {
      // No language hint - let model detect from message
      return message;
    }

    const instruction = this.languageInstructions.get(language)!;
    return `${instruction}\n\n${message}`;
  }

  /**
   * Add support for a new language
   */
  public addLanguage(code: string, instruction: string): void {
    this.languageInstructions.set(code, instruction);
  }

  /**
   * Get all supported languages
   */
  public getSupportedLanguages(): string[] {
    return Array.from(this.languageInstructions.keys());
  }
}
