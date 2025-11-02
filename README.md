# Simple React + SLM Model

A proof-of-concept React application demonstrating clean architecture patterns with a bilingual AI chat interface. Features modern React patterns (custom hooks, TypeScript), OOP backend with dependency injection, and integration with Qwen2.5-3B language model via Ollama.

![Light Theme](./docs/assets/chat-light.png)
![Terminal Theme](./docs/assets/chat-terminal.png)

## ✨ Key Features

- 🤖 **AI-Powered Chat** - Bilingual responses (English/French) from Qwen2.5-3B
- 🎨 **Two Themes** - Light and Old Terminal modes
- 🏗️ **Clean Architecture** - Custom hooks, DI container, SOLID principles
- 🌍 **i18n Support** - Full English/French localization
- ⚡ **Performance** - React.memo, useMemo, request cancellation
- 🐳 **Docker-First** - Complete containerization with hot reload

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js 22, Express, TypeScript (OOP + DI)
- **AI Model**: Ollama with Qwen2.5-3B (bilingual EN/FR)
- **Infrastructure**: Docker Compose, Nginx

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose ([Install Docker](https://docs.docker.com/get-docker/))
- 4GB+ RAM and 3GB+ disk space

### Get Running (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/sergueidmitriev/simple-react-slm-model.git
cd simple-react-slm-model

# 2. Start all services
make dev

# 3. Setup AI model (one-time, ~1.8GB download)
make model-setup

# 4. Open browser
open http://localhost:3002
```

**Services running:**
- Frontend: http://localhost:3002
- Backend: http://localhost:3001
- Ollama: http://localhost:11434

### Test It Works

1. **Send a message**: "What is React?"
2. **Toggle language**: Switch to French and ask "Qu'est-ce que Docker?"
3. **Try themes**: Click theme toggle for Light/Dark/Terminal modes

## 📚 Documentation

- **[Development Guide](./docs/DEVELOPMENT.md)** - Detailed setup, architecture, API docs
- **[Model Setup](./docs/MODEL_SETUP.md)** - Ollama configuration and testing
- **[Integration Guide](./docs/INTEGRATION.md)** - How components work together
- **[Theme Architecture](./docs/THEME_ARCHITECTURE.md)** - Theme system details

## 🔧 Common Commands

```bash
make dev           # Start development with hot reload
make down          # Stop all services
make logs          # View logs
make model-test    # Test the AI model
make clean         # Clean Docker resources
```

## 🐛 Troubleshooting

**Model not responding?**
```bash
make model-list      # Check if model is downloaded
make model-setup     # Re-download if needed
```

**Services not starting?**
```bash
make down
make dev
```

**Port conflicts?**
```bash
# Check ports 3002, 3001, 11434
sudo lsof -i :3002
# Change ports in docker-compose.dev.yml if needed
```

**More help**: See [Development Guide](./docs/DEVELOPMENT.md#troubleshooting)

## 🏗️ Architecture Highlights

**Frontend:**
- Custom hooks separate business logic from UI
- Request cancellation with AbortController
- Discriminated union types for type safety
- Performance optimization with React.memo

**Backend:**
- Interfaces for loose coupling (`IModelService`, `IPromptFormatter`)
- Dependency injection via `ServiceContainer`
- SOLID principles throughout
- Easy to swap model providers

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.