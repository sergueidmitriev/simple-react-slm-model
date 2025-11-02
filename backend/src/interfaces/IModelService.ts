/**
 * Interface for model service implementations
 */
export interface IModelService {
  /**
   * Generate a response from the model
   * @param message - User's message
   * @param language - Optional language hint (en, fr, etc.)
   * @returns Generated response text
   */
  generateResponse(message: string, language?: string): Promise<string>;

  /**
   * Check if the model service is healthy and ready
   * @returns True if healthy, false otherwise
   */
  isHealthy(): Promise<boolean>;

  /**
   * Get information about the current model
   * @returns Model information
   */
  getModelInfo(): Promise<ModelInfo>;
}

export interface ModelInfo {
  name: string;
  version?: string;
  provider: string;
  status: 'ready' | 'loading' | 'unavailable';
}
