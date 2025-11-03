# Integration Guide

How the frontend, backend, and AI model work together.

---

## System Architecture

```
Frontend (React) ←→ Backend (Express) ←→ Ollama API ←→ Model
  Port 3002           Port 3001            Port 11434
```

---

## Request Flow

### 1. User Interaction

User types message and clicks send. Frontend hook captures the input and current language setting.

### 2. API Call

Frontend sends HTTP POST request to backend with message and language preference.

```bash
POST /api/chat
{
  "message": "What is React?",
  "language": "en"
}
```

### 3. Backend Processing

Backend receives request, formats prompt with language hint, and calls Ollama API.

### 4. Model Response

Ollama processes the request through Qwen2.5-3B model and returns generated text.

### 5. Response Chain

Backend returns formatted response to frontend, which displays it in the chat UI.

---

## Bilingual Support

The system automatically responds in the UI language:

**Implementation:**
- Frontend passes current language (`en` or `fr`) to backend
- Backend adds language instruction to prompt
- Model generates response in requested language

**Example prompts:**
- English: `"Answer in English: What is Docker?"`
- French: `"Réponds en français: Qu'est-ce que Docker?"`

---

## Backend Architecture

**Design pattern:** Dependency Injection with interfaces

**Key components:**
- **Service Container** - Manages dependencies (IoC pattern)
- **Model Service** - Communicates with Ollama (implements interface)
- **Prompt Formatter** - Adds language hints (implements interface)
- **Configuration** - Centralized settings

**Benefits:**
- Loose coupling through interfaces
- Easy to swap implementations
- Testable with mocks
- SOLID principles

**Example:** Switching from Ollama to OpenAI requires implementing the same interface, no route changes needed.

---

## Configuration

### Environment Variables

**Backend:**
```bash
OLLAMA_URL=http://model:11434     # Ollama service URL
OLLAMA_MODEL=qwen2.5:3b           # Model name
```

**Frontend:**
```bash
VITE_API_URL=http://localhost:3001  # Backend API URL
```

### Model Parameters

Configurable in backend service:
- **temperature** - Randomness (0.0 = deterministic, 1.0 = creative)
- **top_p** - Nucleus sampling threshold
- **top_k** - Top-k sampling limit

---

## Health Checks

### Model Health

Backend validates:
1. Ollama service is running
2. Model is downloaded
3. API responds correctly

```bash
GET /api/health
```

### Frontend Monitoring

Frontend polls health endpoint every 30 seconds and shows connection status.

---

## Error Handling

**Backend:**
- Catches API errors
- Returns formatted error responses
- Logs errors for debugging

**Frontend:**
- Catches network errors
- Shows translated error messages
- Allows request cancellation
- Retries with exponential backoff

---

## Performance

**Response times (CPU):**
- Simple: 1-3 seconds
- Complex: 3-7 seconds
- Long: 5-10 seconds

**Optimization options:**
- Use smaller model (1.5B parameters)
- Enable GPU acceleration
- Implement response caching
- Add streaming responses

---

## Testing

```bash
# Test Ollama directly
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:3b",
  "prompt": "Test message",
  "stream": false
}'

# Test backend API
curl http://localhost:3001/api/chat -X POST \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "language": "en"}'

# Check health
curl http://localhost:3001/api/health
```

---

## Troubleshooting

**Model not responding:**
- Verify Ollama container is running
- Check model is downloaded
- Review logs for errors

**Slow responses:**
- Monitor CPU/RAM usage
- Consider smaller model
- Lower top_k parameter

**Connection issues:**
- Verify Docker network
- Check service names in docker-compose
- Confirm ports are not blocked

---

## Future Enhancements

- **Streaming responses** - Real-time word-by-word output
- **Conversation context** - Multi-turn conversations
- **Response caching** - Cache common queries
- **Advanced formatting** - Code highlighting, markdown
- **Conversation history** - Save/load past chats

---

## Resources

- [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Qwen2.5 Model Card](https://huggingface.co/Qwen/Qwen2.5-3B-Instruct)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)
