# Simple project with React + SLM Model

A production-ready React application with bilingual chat interface powered by Qwen2.5-3B language model via Ollama.

![Light Theme](./docs/assets/chat-light.png)
*Light Theme - Clean, modern interface*

![Terminal Theme](./docs/assets/chat-terminal.png)
*Terminal Theme - Retro computer aesthetic*

## Project Structure

```
simple-react-slm-model/
├── frontend/                 # React/TypeScript web app
│   ├── src/
│   │   ├── components/       # UI components (Chat, Message)
│   │   ├── services/         # API communication
│   │   ├── types/           # TypeScript definitions
│   │   └── App.tsx
│   ├── Dockerfile           # Production build
│   ├── Dockerfile.dev       # Development build
│   └── nginx.conf           # Nginx configuration
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic (ModelService)
│   │   └── server.ts
│   ├── Dockerfile           # Production build
│   └── Dockerfile.dev       # Development build
├── model/                   # SLM model service (placeholder)
│   └── Dockerfile           # Model service container
├── docker-compose.yml       # Production orchestration
├── docker-compose.dev.yml   # Development overrides
└── Makefile                # Build and development commands
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, CORS, Helmet
- **Infrastructure**: Docker, Docker Compose, Nginx
- **Model**: Ollama with Qwen2.5-3B (bilingual EN/FR)

## 🚀 Getting Started

### Prerequisites

- **Docker & Docker Compose** - [Install Docker](https://docs.docker.com/get-docker/)
- **Git** - For cloning the repository
- **4GB+ RAM** - Required for running the AI model
- **3GB+ disk space** - For Docker images and model

### Quick Start (5 minutes)

**1. Clone the repository:**
```bash
git clone https://github.com/sergueidmitriev/simple-react-slm-model.git
cd simple-react-slm-model
```

**2. Start all services:**
```bash
make dev
```

This command will:
- Start frontend (React) on http://localhost:3002
- Start backend (Express) on http://localhost:3001
- Start Ollama (AI model service) on http://localhost:11434

**3. Setup the AI model (one-time, ~1.8GB download):**

Open a new terminal and run:
```bash
make model-setup
```

Wait ~5 minutes for the model to download. You'll see:
```
✅ Model downloaded successfully!
```

**4. Open the app:**

Visit http://localhost:3002 and start chatting! 🎉

### Testing It Works

**Send a test message:**
- Type: "What is React?"
- You should get a response from the AI model

**Try bilingual support:**
- Click the language toggle (EN ⟷ FR)
- Type: "Qu'est-ce que Docker?"
- The model responds in French!

**Try themes:**
- Click the theme toggle to switch between Light/Dark/Terminal themes

### Troubleshooting

**Services not starting?**
```bash
# Stop everything
make down

# Start fresh
make dev
```

**Model not responding?**
```bash
# Check if model is downloaded
make model-list

# If empty, run setup again
make model-setup
```

**Port already in use?**
```bash
# Check what's using the ports
sudo lsof -i :3002  # Frontend
sudo lsof -i :3001  # Backend
sudo lsof -i :11434 # Ollama

# Stop conflicting service or change ports in docker-compose.dev.yml
```

**Backend can't connect to model?**
```bash
# Check all containers are running
docker ps

# Restart backend
docker-compose restart backend
```

**Something's broken?**
```bash
# Nuclear option - clean everything and start over
make down
make clean
make dev
make model-setup
```

### Stopping the Application

```bash
# Stop all services (preserves data)
make down

# Stop and remove everything including volumes
make clean
```

---

## Quick Start

### Using Makefile (Recommended)

```bash
# View all available commands
make help

# Start development environment
make dev

# Or start production environment
make up

# View logs
make logs

# Stop services
make down

# Clean up Docker resources
make clean
```

### Manual Docker Commands

```bash
# Production mode
docker-compose up --build

# Development mode with hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Frontend: http://localhost:3002 (development) or http://localhost:3000 (production)
# Backend API: http://localhost:3001
# Model service: http://localhost:8000 (placeholder)
```

---

## 🛠️ Development

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Git

### Environment Setup

```bash
# Copy environment template and install dependencies
make dev-setup

# Or manually:
cp .env.example .env
make install
```

### Local Development (without Docker)

```bash
# Install dependencies
make install

# Start frontend (terminal 1)
cd frontend && npm run dev

# Start backend (terminal 2)
cd backend && npm run dev

# Frontend: http://localhost:3000 (Vite dev server)
# Backend: http://localhost:3001
```

## Features

### Current Implementation

- ✅ **Chat Interface**: Clean, responsive chat UI
- ✅ **Real-time Communication**: Frontend ↔ Backend API
- ✅ **Mock Responses**: Placeholder model responses
- ✅ **Health Checks**: API connectivity status
- ✅ **Docker Setup**: Complete containerization
- ✅ **Development Tools**: Hot reload, logging

### Planned Features

- 🔄 **SLM Integration**: Actual language model
- 🔄 **Message History**: Persistent chat history
- 🔄 **User Authentication**: Optional user system
- 🔄 **Model Selection**: Multiple model support
- 🔄 **Advanced UI**: Better styling and UX

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/chat` - Send message to model

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │───▶│   Backend   │───▶│    Model    │
│  (React)    │    │  (Express)  │    │  (Python)   │
│   :3000     │    │    :3001    │    │    :8000    │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Adding Your SLM Model

When you're ready to integrate your chosen SLM model:

1. **Update the model service** (`model/` directory)
2. **Configure model communication** in `backend/src/services/modelService.ts`
3. **Add model-specific environment variables**
4. **Update docker-compose.yml** with model requirements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `make dev`
5. Submit a pull request

## License

MIT License - see LICENSE file for details