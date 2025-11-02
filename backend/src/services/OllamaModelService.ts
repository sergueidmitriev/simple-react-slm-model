import { IModelService, ModelInfo } from '../interfaces/IModelService';
import { IPromptFormatter } from '../interfaces/IPromptFormatter';

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
  };
}

interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

interface OllamaTagsResponse {
  models: Array<{
    name: string;
    modified_at: string;
    size: number;
  }>;
}

/**
 * Model service implementation using Ollama
 */
export class OllamaModelService implements IModelService {
  private readonly baseUrl: string;
  private readonly modelName: string;
  private readonly promptFormatter: IPromptFormatter;
  private readonly temperature: number;
  private readonly topP: number;
  private readonly topK: number;

  constructor(
    baseUrl: string,
    modelName: string,
    promptFormatter: IPromptFormatter,
    options: {
      temperature?: number;
      topP?: number;
      topK?: number;
    } = {}
  ) {
    this.baseUrl = baseUrl;
    this.modelName = modelName;
    this.promptFormatter = promptFormatter;
    this.temperature = options.temperature ?? 0.7;
    this.topP = options.topP ?? 0.9;
    this.topK = options.topK ?? 40;
  }

  public async generateResponse(message: string, language?: string): Promise<string> {
    try {
      const prompt = this.promptFormatter.format(message, language);

      const requestBody: OllamaGenerateRequest = {
        model: this.modelName,
        prompt,
        stream: false,
        options: {
          temperature: this.temperature,
          top_p: this.topP,
          top_k: this.topK,
        },
      };

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as OllamaGenerateResponse;
      return data.response.trim();
    } catch (error) {
      console.error('Model generation error:', error);
      throw new Error('Failed to generate response from model');
    }
  }

  public async generateResponseStream(message: string, language?: string): Promise<ReadableStream<string>> {
    try {
      const prompt = this.promptFormatter.format(message, language);

      const requestBody: OllamaGenerateRequest = {
        model: this.modelName,
        prompt,
        stream: true,
        options: {
          temperature: this.temperature,
          top_p: this.topP,
          top_k: this.topK,
        },
      };

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      // Transform Ollama's streaming response to a stream of text chunks
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      return new ReadableStream<string>({
        async start(controller) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              
              if (done) {
                controller.close();
                break;
              }

              // Decode the chunk
              const chunk = decoder.decode(value, { stream: true });
              
              // Ollama sends newline-delimited JSON objects
              const lines = chunk.split('\n').filter(line => line.trim());
              
              for (const line of lines) {
                try {
                  const json = JSON.parse(line) as OllamaGenerateResponse;
                  if (json.response) {
                    controller.enqueue(json.response);
                  }
                  
                  if (json.done) {
                    controller.close();
                    return;
                  }
                } catch (parseError) {
                  console.warn('Failed to parse streaming chunk:', parseError);
                }
              }
            }
          } catch (error) {
            controller.error(error);
          }
        },
      });
    } catch (error) {
      console.error('Model streaming error:', error);
      throw new Error('Failed to generate streaming response from model');
    }
  }

  public async isHealthy(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      
      if (!response.ok) {
        return false;
      }

      const data = await response.json() as OllamaTagsResponse;
      const modelExists = data.models.some(m => m.name === this.modelName);
      
      if (!modelExists) {
        console.warn(
          `Model ${this.modelName} not found. Available models:`,
          data.models.map(m => m.name).join(', ')
        );
      }
      
      return modelExists;
    } catch (error) {
      console.error('Model health check failed:', error);
      return false;
    }
  }

  public async getModelInfo(): Promise<ModelInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        return this.getUnavailableModelInfo();
      }

      const data = await response.json() as OllamaTagsResponse;
      const model = data.models.find(m => m.name === this.modelName);

      if (!model) {
        return this.getUnavailableModelInfo();
      }

      return {
        name: this.modelName,
        provider: 'Ollama',
        status: 'ready',
        version: new Date(model.modified_at).toISOString(),
      };
    } catch (error) {
      return this.getUnavailableModelInfo();
    }
  }

  private getUnavailableModelInfo(): ModelInfo {
    return {
      name: this.modelName,
      provider: 'Ollama',
      status: 'unavailable',
    };
  }

  /**
   * Get current generation parameters
   */
  public getGenerationParams() {
    return {
      temperature: this.temperature,
      topP: this.topP,
      topK: this.topK,
    };
  }
}
