# Development Guide

This guide covers detailed development setup, architecture, and advanced usage.

## Table of Contents

- [Local Development](#local-development)
- [Project Structure](#project-structure)
- [Architecture Details](#architecture-details)
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

# Pull model
ollama pull qwen2.5:3b

# Run Ollama service
ollama serve
# Runs on http://localhost:11434
```

### Environment Variables

**Backend** (create `backend/.env`):
```bash
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b
```

**Frontend** (create `frontend/.env`):
```bash
VITE_API_URL=http://localhost:3001
```

---

## Project Structure

```
.
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Chat.tsx        # Main chat (simplified with hooks)
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── icons.tsx       # SVG components
│   │   ├── hooks/              # Custom hooks (business logic)
│   │   │   ├── useHealthCheck.ts
│   │   │   └── useChatMessages.ts
│   │   ├── services/           # API layer
│   │   │   └── api.ts          # Axios client with interceptors
│   │   ├── contexts/           # React contexts
│   │   │   └── ThemeContext.tsx
│   │   ├── constants/          # Configuration
│   │   │   └── api.ts
│   │   ├── utils/              # Utilities
│   │   │   ├── errors.ts
│   │   │   ├── retry.ts
│   │   │   └── messageId.ts
│   │   ├── types/              # TypeScript types
│   │   ├── i18n/               # Translations (EN/FR)
│   │   └── styles/             # Theme CSS
│   ├── Dockerfile              # Production (Nginx)
│   └── Dockerfile.dev          # Development (Node)
│
├── backend/                     # Express API
│   ├── src/
│   │   ├── interfaces/         # TypeScript interfaces
│   │   │   ├── IModelService.ts
│   │   │   └── IPromptFormatter.ts
│   │   ├── services/           # Service implementations
│   │   │   └── OllamaModelService.ts
│   │   ├── formatters/         # Prompt formatting
│   │   │   └── BilingualPromptFormatter.ts
│   │   ├── container/          # DI container
│   │   │   └── ServiceContainer.ts
│   │   ├── config/             # Configuration
│   │   │   └── AppConfig.ts
│   │   ├── routes/             # API routes
│   │   │   └── chat.ts
│   │   └── server.ts           # Express app
│   ├── Dockerfile              # Production
│   └── Dockerfile.dev          # Development
│
├── scripts/                     # Helper scripts
│   ├── setup-model.sh
│   ├── test-model.sh
│   └── interactive-model.sh
│
├── docs/                        # Documentation
│   ├── DEVELOPMENT.md          # This file
│   ├── MODEL_SETUP.md          # Model guide
│   ├── INTEGRATION.md          # Integration details
│   └── THEME_ARCHITECTURE.md   # Theme system
│
├── docker-compose.yml           # Production config
├── docker-compose.dev.yml       # Development config
└── Makefile                     # Commands
```

---

## Architecture Details

### Frontend Architecture

**Modern React Patterns:**

```typescript
// Custom Hooks (business logic)
useHealthCheck         - API health monitoring with AbortController
useChatMessages        - Message state + API calls with cancellation

// Components (presentational only)
Chat                   - Main container (33 lines, uses hooks)
MessageList            - Message display with memoization
MessageInput           - Input handling
ErrorBoundary          - Error catching

// Services
api.ts                 - HTTP client with interceptors
chatService            - API abstraction with retry logic

// Performance
React.memo             - Prevent re-renders (Message component)
useMemo                - Memoized values (5 components)
useCallback            - Stable callbacks (hooks)
```

**Key Features:**
- ✅ No React.FC (modern pattern)
- ✅ Named imports only
- ✅ Discriminated union types
- ✅ Request cancellation (AbortController)
- ✅ Error boundaries
- ✅ Retry with exponential backoff

### Backend Architecture

**OOP Design with Dependency Injection:**

```
ServiceContainer (IoC/DI)
├── AppConfig - Centralized configuration
├── BilingualPromptFormatter (IPromptFormatter)
│   └── Formats prompts with language hints
└── OllamaModelService (IModelService)
    ├── generateResponse(message, language)
    ├── isHealthy()
    └── getModelInfo()
```

**Interfaces:**
```typescript
interface IModelService {
  generateResponse(message: string, language?: string): Promise<string>;
  isHealthy(): Promise<boolean>;
  getModelInfo(): Promise<ModelInfo>;
}

interface IPromptFormatter {
  format(message: string, language?: string): string;
}
```

**Benefits:**
- ✅ Loose coupling via interfaces
- ✅ Easy to swap implementations (Ollama → OpenAI)
- ✅ Testable with mocks
- ✅ SOLID principles
- ✅ Clear dependency graph

### Data Flow

```
User Input
    ↓
useChatMessages (hook)
    ↓
chatService.sendMessage(message, language)
    ↓
POST /api/chat { message, language }
    ↓
chat.ts route
    ↓
ServiceContainer.modelService
    ↓
OllamaModelService.generateResponse()
    ↓
BilingualPromptFormatter.format() → "Réponds en français: {message}"
    ↓
fetch('http://model:11434/api/generate')
    ↓
Ollama → Qwen2.5-3B
    ↓
Response → Backend → Frontend → UI
```

---

## Available Commands

### Makefile Commands

**Services:**
```bash
make help              # Show all commands
make dev               # Start development
make up                # Start production
make down              # Stop all services
make logs              # View logs
make clean             # Clean Docker resources
```

**Model:**
```bash
make model-setup       # Pull Qwen2.5-3B
make model-test        # Run tests
make model-chat        # Interactive chat
make model-list        # List models
```

**Frontend:**
```bash
make frontend-dev      # Local dev server
make frontend-build    # Build for production
make frontend-lint     # Lint code
```

**Builds:**
```bash
make build             # Build all services
make build-frontend    # Build frontend only
make build-backend     # Build backend only
```

### Docker Commands

**Development:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

**Production:**
```bash
docker-compose up --build
```

**Logs:**
```bash
docker-compose logs -f                    # All services
docker-compose logs -f backend            # Backend only
docker logs simple-react-slm-model_model_1  # Model service
```

**Clean:**
```bash
docker-compose down -v                    # Stop + remove volumes
docker system prune -a                    # Clean everything
```

---

## API Endpoints

### Chat API

**POST** `/api/chat`

Send a message to the model.

**Request:**
```json
{
  "message": "What is Docker?",
  "language": "en"  // Optional: "en" or "fr"
}
```

**Response (Success):**
```json
{
  "message": "Docker is a platform for...",
  "success": true
}
```

**Response (Error):**
```json
{
  "error": "Failed to process message",
  "success": false
}
```

### Health Check

**GET** `/api/health`

Check backend and model availability.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-02T10:30:00.000Z",
  "service": "simple-react-slm-backend",
  "model": {
    "available": true,
    "name": "qwen2.5:3b"
  }
}
```

### Model Info

**GET** `/api/model/info`

Get information about the loaded model.

**Response:**
```json
{
  "data": {
    "name": "qwen2.5:3b",
    "provider": "Ollama",
    "status": "ready",
    "version": "2025-11-02T10:00:00.000Z"
  },
  "success": true
}
```

---

## Environment Variables

### Backend Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Backend server port |
| `NODE_ENV` | `development` | Environment (development/production) |
| `FRONTEND_URL` | `http://localhost:3000` | Frontend URL for CORS |
| `OLLAMA_URL` | `http://model:11434` | Ollama service URL |
| `OLLAMA_MODEL` | `qwen2.5:3b` | Model name to use |

### Frontend Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3001` | Backend API URL |

---

## Additional Resources

- [Model Setup Guide](./MODEL_SETUP.md) - Detailed Ollama configuration
- [Integration Guide](./INTEGRATION.md) - Architecture and data flow
- [Theme Architecture](./THEME_ARCHITECTURE.md) - Theme system details
- [Ollama Documentation](https://github.com/ollama/ollama)
- [Qwen2.5 Model Card](https://huggingface.co/Qwen/Qwen2.5-3B-Instruct)
