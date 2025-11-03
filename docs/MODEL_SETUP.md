# Model Setup Guide

Guide for setting up and testing the AI model (Qwen2.5-3B via Ollama).

---

## Quick Start

### 1. Start Services

```bash
make dev
```

Services running:
- Frontend: http://localhost:3002
- Backend: http://localhost:3001
- Ollama API: http://localhost:11434

### 2. Download Model

```bash
./scripts/setup-model.sh
# or
make model-setup
```

**Note:** First download takes ~5 minutes (1.8GB). Model is cached.

### 3. Test Model

```bash
./scripts/test-model.sh
# or
make model-test
```

### 4. Interactive Chat

```bash
./scripts/interactive-model.sh
# or
make model-chat
```

---

## Manual Commands

```bash
# List installed models
docker exec -it <container-name> ollama list

# Pull specific model
docker exec -it <container-name> ollama pull qwen2.5:3b

# Interactive chat
docker exec -it <container-name> ollama run qwen2.5:3b

# Single question
docker exec <container-name> ollama run qwen2.5:3b "Your question"
```

---

## API Usage

### Direct Ollama API

**Single response:**
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:3b",
  "prompt": "Explain Docker in one sentence",
  "stream": false
}'
```

**Streaming response:**
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:3b",
  "prompt": "Tell me about TypeScript",
  "stream": true
}'
```

### Backend API

```bash
curl http://localhost:3001/api/chat -X POST \
  -H "Content-Type: application/json" \
  -d '{"message": "What is Docker?", "language": "en"}'
```

---

## Model Specifications

- **Name:** Qwen2.5-3B-Instruct
- **Size:** ~1.8GB (3 billion parameters)
- **Languages:** Multilingual (29 languages including EN/FR)
- **Provider:** Alibaba Cloud (Qwen team)
- **Optimization:** GGUF format for CPU efficiency

---

## Performance

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

**Note:** GPU acceleration available with NVIDIA Docker.

---

## Troubleshooting

### Model Not Found
```bash
# Pull again
docker exec -it <container-name> ollama pull qwen2.5:3b
```

### Ollama Not Running
```bash
# Check container
docker ps | grep ollama

# Restart if needed
make down && make dev
```

### Slow Responses
```bash
# Check resource usage
docker stats

# Consider smaller model
docker exec <container-name> ollama pull qwen2.5:1.5b
```

### Clear Cache
```bash
# Remove model
docker exec -it <container-name> ollama rm qwen2.5:3b

# Re-download
make model-setup
```

---

## Alternative Models

```bash
# Smaller/faster options
ollama pull qwen2.5:1.5b      # 1.5B parameters
ollama pull phi3:mini         # 3.8B parameters
ollama pull gemma:2b          # 2B parameters
ollama pull tinyllama:1.1b    # 1.1B parameters (fastest)
```

Update backend environment variable to use different model.

---

## Resources

- [Ollama Documentation](https://github.com/ollama/ollama)
- [Ollama API Reference](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Available Models](https://ollama.com/library)
- [Qwen2.5 Model Card](https://huggingface.co/Qwen/Qwen2.5-3B-Instruct)
