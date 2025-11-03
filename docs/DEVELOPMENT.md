# Development Guide

This guide covers development setup, architecture, and common tasks.

## Table of Contents

- [Local Development](#local-development)
- [Architecture Overview](#architecture-overview)
- [Available Commands](#available-commands)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)

---

## Local Development

### Without Docker

**Prerequisites:**
- Node.js 18+
- npm or yarn

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

**Backend:**
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3001
```

**Model (Ollama locally):**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull and run model
ollama pull qwen2.5:3b
ollama serve
# Runs on http://localhost:11434
```

### Environment Configuration

**Backend** (`backend/.env`):
```bash
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b
```

**Frontend** (`frontend/.env`):
```bash
VITE_API_URL=http://localhost:3001
```

---

## Architecture Overview

### Frontend

**Modern React patterns:**
- Custom hooks for business logic
- Presentational components
- Request cancellation with AbortController
- Strategic performance optimizations
- Type-safe discriminated unions

**Key concepts:**
- Hooks separate concerns from UI
- API layer with interceptors and retry logic
- Error boundaries for resilience
- Theme system with CSS custom properties
- Internationalization support

### Backend

**OOP design with Dependency Injection:**
- Service container manages dependencies
- Interface-based abstractions
- SOLID principles
- Swappable implementations
- Centralized configuration

**Architecture layers:**
```
Service Container (IoC/DI)
├── Configuration
├── Prompt Formatter (interface)
└── Model Service (interface)
    └── Communicates with Ollama API
```

### Data Flow

```
User Input
    ↓
Custom Hook (state + logic)
    ↓
API Service Layer
    ↓
Backend Route Handler
    ↓
Service Container
    ↓
Model Service (via interface)
    ↓
Prompt Formatter
    ↓
Ollama API
    ↓
Response back through chain
```

---

## Available Commands

### Makefile Commands

```bash
make help              # Show all commands
make dev               # Start development
make up                # Start production
make down              # Stop services
make logs              # View logs
make clean             # Clean Docker resources

# Model commands
make model-setup       # Download model
make model-test        # Test model
make model-chat        # Interactive chat
make model-list        # List models

# Development
make frontend-dev      # Local frontend dev
make frontend-build    # Build frontend
make frontend-lint     # Lint code
```

### Docker Commands

```bash
# Development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production
docker-compose up --build

# Logs
docker-compose logs -f
docker-compose logs -f backend

# Clean
docker-compose down -v
docker system prune -a
```

---

## API Endpoints

### Chat

**POST** `/api/chat`

Send message to model.

```json
{
  "message": "Your question",
  "language": "en"  // Optional: "en" or "fr"
}
```

**Response:**
```json
{
  "message": "AI response",
  "success": true
}
```

### Health Check

**GET** `/api/health`

Check system status.

```json
{
  "status": "healthy",
  "timestamp": "2025-11-02T10:30:00.000Z",
  "model": {
    "available": true,
    "name": "qwen2.5:3b"
  }
}
```

### Model Info

**GET** `/api/model/info`

Get model information.

```json
{
  "data": {
    "name": "qwen2.5:3b",
    "provider": "Ollama",
    "status": "ready"
  },
  "success": true
}
```

---

## Environment Variables

### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `FRONTEND_URL` | `http://localhost:3000` | CORS origin |
| `OLLAMA_URL` | `http://model:11434` | Model service URL |
| `OLLAMA_MODEL` | `qwen2.5:3b` | Model name |

### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3001` | Backend API URL |

---

## Additional Resources

- [Model Setup Guide](./MODEL_SETUP.md)
- [Integration Guide](./INTEGRATION.md)
- [Theme Architecture](./THEME_ARCHITECTURE.md)
- [Ollama Documentation](https://github.com/ollama/ollama)
