# Model Integration Guide

This document explains how the Qwen2.5-3B model is integrated into the application.

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

### 3. Backend Processing

**Backend** (`backend/src/routes/chat.ts`):
```typescript
// Receives request
const { message, language } = req.body;

// Calls model service
const response = await modelService.generateResponse(message, language);
```

### 4. Ollama API Call

**Backend** (`backend/src/services/modelService.ts`):
```typescript
// Format prompt with language hint
const prompt = language === 'fr' 
  ? `Réponds en français à la question suivante:\n\n${message}`
  : `Answer in English to the following question:\n\n${message}`;

// Call Ollama API
const response = await fetch('http://model:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'qwen2.5:3b',
    prompt: prompt,
    stream: false
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

**Backend** (`modelService.ts`):
- Adds language prompt prefix
- FR: `"Réponds en français à la question suivante:\n\n{message}"`
- EN: `"Answer in English to the following question:\n\n{message}"`

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

### Model Parameters

**Backend** (`modelService.ts`):
```typescript
options: {
  temperature: 0.7,  // Creativity (0.0 = deterministic, 1.0 = creative)
  top_p: 0.9,        // Nucleus sampling
  top_k: 40,         // Top-k sampling
}
```

**Adjust for different behaviors:**
- **More deterministic**: `temperature: 0.3`
- **More creative**: `temperature: 0.9`
- **Faster responses**: Lower `top_k`

---

## Health Checks

### Model Health Endpoint

**Backend** health check validates:
1. Ollama service is running
2. Model is downloaded and available
3. API is responding

```typescript
async isHealthy(): Promise<boolean> {
  const response = await fetch(`${this.ollamaUrl}/api/tags`);
  const data = await response.json();
  return data.models.some(m => m.name === 'qwen2.5:3b');
}
```

### Frontend Connection Status

**Frontend** (`useHealthCheck.ts`):
- Polls `/api/health` every 30 seconds
- Shows connection indicator in UI
- Disables chat if disconnected

---

## Error Handling

### Backend Errors

**Model Service** (`modelService.ts`):
```typescript
try {
  const response = await fetch(ollamaUrl);
  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`);
  }
} catch (error) {
  console.error('Model generation error:', error);
  throw new Error('Failed to generate response from model');
}
```

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

## References

- [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Qwen2.5 Model Card](https://huggingface.co/Qwen/Qwen2.5-3B-Instruct)
- [Model Setup Guide](./MODEL_SETUP.md)
