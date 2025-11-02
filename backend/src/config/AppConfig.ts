/**
 * Application configuration
 */
export class AppConfig {
  public readonly port: number;
  public readonly nodeEnv: string;
  public readonly frontendUrl: string;
  public readonly ollamaUrl: string;
  public readonly ollamaModel: string;

  constructor() {
    this.port = +(process.env.PORT || 3001);
    this.nodeEnv = process.env.NODE_ENV || 'development';
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://model:11434';
    this.ollamaModel = process.env.OLLAMA_MODEL || 'qwen2.5:3b';
  }

  public isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  public isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
}
