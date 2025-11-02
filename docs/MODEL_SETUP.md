# Model Setup Guide

## Qwen2.5-3B with Ollama

This project uses **Qwen2.5-3B-Instruct** - a small, bilingual (English/French) language model running via Ollama.

### Model Specifications

- **Name:** Qwen2.5-3B-Instruct
- **Size:** ~1.8GB (3 billion parameters)
- **Languages:** 29 languages including English and French
- **Provider:** Alibaba (Qwen team)
- **Format:** GGUF (optimized for CPU)
- **API:** Ollama REST API on port 11434

---

## Quick Start

### 1. Start Services

```bash
# Start all services including Ollama
make dev
```

This starts:
- Frontend: http://localhost:3002
- Backend: http://localhost:3001
- **Ollama API: http://localhost:11434**

### 2. Download Model

```bash
# Pull the Qwen2.5-3B model (one-time setup)
./scripts/setup-model.sh
```

**Note:** First download takes ~5 minutes (1.8GB). Model is cached in Docker volume.

### 3. Test Model

```bash
# Run automated tests
./scripts/test-model.sh
```

### 4. Interactive Chat

```bash
# Start interactive terminal chat
./scripts/interactive-model.sh
```

---

## Manual Commands

### Pull Model
```bash
docker exec -it simple-react-slm-model-model-1 ollama pull qwen2.5:3b
```

### List Models
```bash
docker exec -it simple-react-slm-model-model-1 ollama list
```

### Interactive Chat
```bash
docker exec -it simple-react-slm-model-model-1 ollama run qwen2.5:3b
```

### Single Question (English)
```bash
docker exec simple-react-slm-model-model-1 ollama run qwen2.5:3b "What is Docker?"
```

### Single Question (French)
```bash
docker exec simple-react-slm-model-model-1 ollama run qwen2.5:3b "Qu'est-ce que React?"
```

---

## API Usage

### REST API Example

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:3b",
  "prompt": "Explain React in one sentence",
  "stream": false
}'
```

### With Streaming

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:3b",
  "prompt": "Tell me about TypeScript",
  "stream": true
}'
```

### Bilingual Example

```bash
# English
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:3b",
  "prompt": "Answer in English: What is Node.js?",
  "stream": false
}'

# French
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:3b",
  "prompt": "Réponds en français: Qu'\''est-ce que Node.js?",
  "stream": false
}'
```

---

## Troubleshooting

### Model Not Found
```bash
# Pull it again
docker exec -it simple-react-slm-model-model-1 ollama pull qwen2.5:3b
```

### Ollama Not Running
```bash
# Check if container is running
docker ps | grep ollama

# If not, start services
make dev
```

### Clear Model Cache
```bash
# Remove model
docker exec -it simple-react-slm-model-model-1 ollama rm qwen2.5:3b

# Pull fresh copy
docker exec -it simple-react-slm-model-model-1 ollama pull qwen2.5:3b
```

### Check Logs
```bash
docker logs simple-react-slm-model-model-1
```

---

## Model Performance

### System Requirements

**Minimum:**
- 4GB RAM
- 2 CPU cores
- 2GB disk space

**Recommended:**
- 8GB RAM
- 4 CPU cores
- 3GB disk space

### Response Times (CPU)

- Simple questions: 1-3 seconds
- Complex questions: 3-7 seconds
- Long responses: 5-10 seconds

**Note:** GPU acceleration available if using NVIDIA GPU with Docker.

---

## Next Steps

After testing the model from command line:

1. **Integrate with Backend** - Update `backend/src/services/modelService.ts`
2. **Connect to UI** - Wire up the chat interface
3. **Add Language Detection** - Auto-detect user language
4. **Implement Streaming** - Real-time response streaming
5. **Add Context Memory** - Multi-turn conversations

See the backend implementation guide for integration details.

---

## Alternative Models

To use a different model:

```bash
# Pull alternative model
docker exec -it simple-react-slm-model-model-1 ollama pull <model-name>

# Available options:
# - phi3:mini (3.8B, better English)
# - gemma:2b (2B, Google)
# - tinyllama:1.1b (1.1B, fastest)
# - qwen2:1.5b (1.5B, smaller)
```

Update the model name in your backend code accordingly.

---

## Resources

- [Ollama Documentation](https://github.com/ollama/ollama)
- [Qwen2.5 Model Card](https://huggingface.co/Qwen/Qwen2.5-3B-Instruct)
- [Ollama API Reference](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Available Models](https://ollama.com/library)
