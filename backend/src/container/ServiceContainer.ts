import { AppConfig } from '../config/AppConfig';
import { IModelService } from '../interfaces/IModelService';
import { IPromptFormatter } from '../interfaces/IPromptFormatter';
import { BilingualPromptFormatter } from '../formatters/BilingualPromptFormatter';
import { OllamaModelService } from '../services/OllamaModelService';

/**
 * Dependency Injection Container
 * Manages application services and their dependencies
 */
export class ServiceContainer {
  private static instance: ServiceContainer;
  
  private readonly _config: AppConfig;
  private readonly _promptFormatter: IPromptFormatter;
  private readonly _modelService: IModelService;

  private constructor() {
    // Initialize configuration
    this._config = new AppConfig();

    // Initialize services with dependencies
    this._promptFormatter = new BilingualPromptFormatter();
    
    this._modelService = new OllamaModelService(
      this._config.ollamaUrl,
      this._config.ollamaModel,
      this._promptFormatter,
      {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      }
    );
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  /**
   * Get application configuration
   */
  public get config(): AppConfig {
    return this._config;
  }

  /**
   * Get model service
   */
  public get modelService(): IModelService {
    return this._modelService;
  }

  /**
   * Get prompt formatter
   */
  public get promptFormatter(): IPromptFormatter {
    return this._promptFormatter;
  }

  /**
   * Reset container (useful for testing)
   */
  public static reset(): void {
    ServiceContainer.instance = null as any;
  }
}
