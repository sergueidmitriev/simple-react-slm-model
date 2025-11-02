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

export class ModelService {
  private readonly ollamaUrl: string;
  private readonly modelName: string;

  constructor() {
    // In Docker, 'model' is the service name from docker-compose
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://model:11434';
    this.modelName = process.env.OLLAMA_MODEL || 'qwen2.5:3b';
  }

  async generateResponse(message: string, language?: string): Promise<string> {
    try {
      // Add language hint to the prompt if provided
      const prompt = this.formatPromptWithLanguage(message, language);

      const requestBody: OllamaGenerateRequest = {
        model: this.modelName,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40,
        },
      };

      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
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

  private formatPromptWithLanguage(message: string, language?: string): string {
    // Add language context to help the model respond in the correct language
    if (language === 'fr') {
      return `Réponds en français à la question suivante:\n\n${message}`;
    } else if (language === 'en') {
      return `Answer in English to the following question:\n\n${message}`;
    }
    // If no language specified, let the model detect from the message
    return message;
  }

  async isHealthy(): Promise<boolean> {
    try {
      // Check if Ollama is responding
      const response = await fetch(`${this.ollamaUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      if (!response.ok) {
        return false;
      }

      const data = await response.json() as { models: Array<{ name: string }> };
      
      // Check if our model is available
      const modelExists = data.models.some(m => m.name === this.modelName);
      
      if (!modelExists) {
        console.warn(`Model ${this.modelName} not found in Ollama. Available models:`, 
          data.models.map(m => m.name).join(', '));
      }
      
      return modelExists;
    } catch (error) {
      console.error('Model health check failed:', error);
      return false;
    }
  }
}