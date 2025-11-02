# Model Integration Guide

**← [Back to README](../README.md)** | **[Model Setup Guide →](./MODEL_SETUP.md)**

---

This document explains how the Qwen2.5-3B model is integrated into the application through the frontend, backend, and Ollama layers.

---

## Architecture Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │ ──────> │   Backend   │ ──────> │   Ollama    │ ──────> │  Qwen2.5-3B │
│   (React)   │ <────── │  (Express)  │ <────── │   Service   │ <────── │    Model    │
└─────────────┘         └─────────────┘         └─────────────┘         └─────────────┘
  Port: 3002              Port: 3001              Port: 11434             In-memory
```

---

## Data Flow

### 1. User Sends Message

**Frontend** (`src/hooks/useChatMessages.ts`):
```typescript
// User types message and submits
const response = await chatService.sendMessage(
  userMessage.content,
  i18n.language,  // Current UI language (en/fr)
  abortController.signal
);
```

### 2. API Call

**Frontend** (`src/services/api.ts`):
```typescript
// POST /api/chat with language preference
const response = await api.post(
  API_ENDPOINTS.CHAT, 
  { 
    message: "What is React?",
    language: "en"  // or "fr"
  }
);
```

### Backend Processing

**Backend** (`backend/src/routes/chat.ts`):
```typescript
// Dependency injection - gets service from container
const container = ServiceContainer.getInstance();
const modelService = container.modelService;

// Receives request
const { message, language } = req.body;

// Calls model service (via interface)
const response = await modelService.generateResponse(message, language);
```

### 4. Ollama API Call

**Backend** (`backend/src/services/OllamaModelService.ts`):
```typescript
// Format prompt with language hint using formatter
const prompt = this.promptFormatter.format(message, language);
// Result: "Réponds en français à la question suivante:\n\nQu'est-ce que Docker?"

// Call Ollama API
const response = await fetch('http://model:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'qwen2.5:3b',
    prompt: prompt,
    stream: false,
    options: {
      temperature: 0.7,
      top_p: 0.9,
      top_k: 40
    }
  })
});
```

### 5. Model Generates Response

**Ollama** processes the prompt through Qwen2.5-3B and returns:
```json
{
  "model": "qwen2.5:3b",
  "response": "React is a JavaScript library for building user interfaces...",
  "done": true
}
```

### 6. Response Returns to User

**Backend** → **Frontend** → **UI**:
```typescript
// Backend sends to frontend
res.json({
  message: "React is a JavaScript library...",
  success: true
});

// Frontend displays in chat
const assistantMessage: Message = {
  id: generateMessageId(),
  content: response.message,
  role: 'assistant',
  timestamp: new Date()
};
```

---

## Bilingual Support

### Language Detection

The model automatically detects and responds in the UI language:

**English UI:**
```
User: "What is Docker?"
Model: "Docker is a platform for developing, shipping, and running applications..."
```

**French UI:**
```
User: "Qu'est-ce que Docker?"
Model: "Docker est une plateforme pour développer, expédier et exécuter des applications..."
```

### Implementation

**Frontend** (`useChatMessages.ts`):
- Gets current language from `i18n.language`
- Passes to API: `en` or `fr`

**Backend** (`ServiceContainer.ts`):
- Injects `BilingualPromptFormatter` into `OllamaModelService`
- Formatter adds language-specific instructions

**Formatter** (`BilingualPromptFormatter.ts`):
- FR: `"Réponds en français à la question suivante:\n\n{message}"`
- EN: `"Answer in English to the following question:\n\n{message}"`
- Supports ES, DE, and extensible to more languages

**Model**:
- Qwen2.5 understands language instructions
- Generates response in requested language

---

## Configuration

### Environment Variables

**Backend** (`.env` or `docker-compose.yml`):
```bash
OLLAMA_URL=http://model:11434  # Default: Ollama service URL
OLLAMA_MODEL=qwen2.5:3b        # Default: Model name
```

All configuration centralized in `AppConfig.ts`.

### Model Parameters

**Backend** (`ServiceContainer.ts`):
```typescript
new OllamaModelService(
  config.ollamaUrl,
  config.ollamaModel,
  promptFormatter,
  {
    temperature: 0.7,  // Creativity (0.0 = deterministic, 1.0 = creative)
    top_p: 0.9,        // Nucleus sampling
    top_k: 40,         // Top-k sampling
  }
)
```

**Adjust for different behaviors:**
- **More deterministic**: `temperature: 0.3`
- **More creative**: `temperature: 0.9`
- **Faster responses**: Lower `top_k`

### Dependency Injection

**Backend** follows SOLID principles with DI:

```typescript
// ServiceContainer.ts - IoC Container
class ServiceContainer {
  private _config: AppConfig;
  private _promptFormatter: IPromptFormatter;
  private _modelService: IModelService;
  
  constructor() {
    this._config = new AppConfig();
    this._promptFormatter = new BilingualPromptFormatter();
    this._modelService = new OllamaModelService(
      this._config.ollamaUrl,
      this._config.ollamaModel,
      this._promptFormatter
    );
  }
}
```

**Benefits:**
- Loose coupling via interfaces
- Easy to swap implementations
- Testable with mocks
- Single source of truth

---

## Health Checks

### Model Health Endpoint

**Backend** (`OllamaModelService.ts`) implements `IModelService.isHealthy()`:

```typescript
async isHealthy(): Promise<boolean> {
  const response = await fetch(`${this.baseUrl}/api/tags`);
  const data = await response.json() as OllamaTagsResponse;
  return data.models.some(m => m.name === this.modelName);
}
```

**Health check validates:**
1. Ollama service is running
2. Model is downloaded and available
3. API is responding

**New endpoint** - Get model info:
```bash
curl http://localhost:3001/api/model/info
# Returns: { name, provider, status, version }
```

### Frontend Connection Status

**Frontend** (`useHealthCheck.ts`):
- Polls `/api/health` every 30 seconds
- Shows connection indicator in UI
- Disables chat if disconnected

---

## Error Handling

### Backend Errors

**Model Service** (`OllamaModelService.ts`):
```typescript
async generateResponse(message: string, language?: string): Promise<string> {
  try {
    const prompt = this.promptFormatter.format(message, language);
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      body: JSON.stringify({ model: this.modelName, prompt, stream: false })
    });
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }
    
    return (await response.json()).response.trim();
  } catch (error) {
    console.error('Model generation error:', error);
    throw new Error('Failed to generate response from model');
  }
}
```

**Separation of concerns:**
- `OllamaModelService` - API communication
- `BilingualPromptFormatter` - Prompt formatting
- `ServiceContainer` - Wiring dependencies
- `chat.ts` - Route handling

### Frontend Errors

**Chat Hook** (`useChatMessages.ts`):
- Catches API errors
- Displays error message in chat
- Uses translated error messages from i18n

---

## Testing

### 1. Manual Testing

**Start services:**
```bash
make dev
```

**Test in browser:**
1. Open http://localhost:3002
2. Type: "What is React?"
3. Switch to French
4. Type: "Qu'est-ce que TypeScript?"

### 2. API Testing

**Direct Ollama call:**
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:3b",
  "prompt": "What is Docker?",
  "stream": false
}'
```

**Backend API call:**
```bash
curl http://localhost:3001/api/chat -X POST \
  -H "Content-Type: application/json" \
  -d '{"message": "What is Docker?", "language": "en"}'
```

### 3. Health Check

```bash
curl http://localhost:3001/api/health
```

---

## Performance

### Response Times

**Development (CPU only):**
- Simple questions: 2-4 seconds
- Complex questions: 4-8 seconds
- Long responses: 6-12 seconds

**Production (recommended):**
- Use GPU-enabled container for faster responses
- Enable streaming for real-time output
- Add response caching for common queries

### Optimization Tips

1. **Reduce model size:**
   ```bash
   docker exec <container> ollama pull qwen2.5:1.5b  # Smaller, faster
   ```

2. **Enable streaming** (future):
   ```typescript
   stream: true  // Real-time word-by-word output
   ```

3. **Add caching** (future):
   - Cache common questions
   - Store recent conversations
   - Implement RAG for context

---

## Troubleshooting

### Model Not Responding

**Check Ollama is running:**
```bash
docker ps | grep model
docker logs simple-react-slm-model_model_1
```

**Verify model is downloaded:**
```bash
make model-list
```

**Re-download if needed:**
```bash
make model-setup
```

### Backend Can't Connect to Ollama

**Check Docker network:**
```bash
docker network inspect simple-react-slm-model_app-network
```

**Verify service name:**
- In `docker-compose.yml`, service is named `model`
- Backend uses `http://model:11434` (Docker DNS)

### Slow Responses

**Check CPU usage:**
```bash
docker stats
```

**Consider:**
- Use smaller model (`qwen2.5:1.5b`)
- Add GPU support (NVIDIA Docker)
- Reduce context length
- Lower `top_k` parameter

---

## Next Steps

### Planned Enhancements

1. **Streaming Responses**
   - Real-time word-by-word output
   - Better UX for long answers

2. **Conversation Context**
   - Remember previous messages
   - Multi-turn conversations

3. **Response Caching**
   - Cache common queries
   - Reduce model calls

4. **Advanced Features**
   - Code highlighting in responses
   - Markdown rendering
   - Copy response button
   - Conversation history

---

## Backend Architecture Details

### OOP Design Pattern

```
┌─────────────────────────┐
│   ServiceContainer      │  IoC/DI Container
│   (Singleton)           │
├─────────────────────────┤
│ - config: AppConfig     │
│ - promptFormatter       │
│ - modelService          │
└─────────────────────────┘
           │
           ├──> AppConfig
           │    - port, nodeEnv
           │    - ollamaUrl, ollamaModel
           │
           ├──> BilingualPromptFormatter
           │    implements IPromptFormatter
           │    - format(message, lang)
           │
           └──> OllamaModelService
                implements IModelService
                - generateResponse()
                - isHealthy()
                - getModelInfo()
```

### Interfaces

**`IModelService`** - Model operations contract:
```typescript
interface IModelService {
  generateResponse(message: string, language?: string): Promise<string>;
  isHealthy(): Promise<boolean>;
  getModelInfo(): Promise<ModelInfo>;
}
```

**`IPromptFormatter`** - Prompt formatting contract:
```typescript
interface IPromptFormatter {
  format(message: string, language?: string): string;
}
```

### Benefits

✅ **Testability** - Easy to mock interfaces for unit tests
✅ **Flexibility** - Swap implementations (Ollama → OpenAI)
✅ **Maintainability** - Clear separation of concerns
✅ **Type Safety** - Compile-time checks via interfaces
✅ **SOLID** - Single responsibility, dependency inversion

### Example: Swapping Model Provider

```typescript
// Create new implementation
class OpenAIModelService implements IModelService {
  async generateResponse(message: string): Promise<string> {
    // OpenAI API logic
  }
  // ... other methods
}

// Update container
class ServiceContainer {
  constructor() {
    this._modelService = new OpenAIModelService(...);  // Changed!
  }
}

// Routes stay the same - they use IModelService interface
```

---

## References

- [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Qwen2.5 Model Card](https://huggingface.co/Qwen/Qwen2.5-3B-Instruct)
- [Model Setup Guide](./MODEL_SETUP.md)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)

---

**← [Back to README](../README.md)** | **[Model Setup Guide →](./MODEL_SETUP.md)** | **[Theme Architecture →](./THEME_ARCHITECTURE.md)**
