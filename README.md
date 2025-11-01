# Simple React SLM Model

A React/TypeScript web application for interacting with Small Language Models, running in Docker containers.

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
- **Model**: Python-based (to be implemented)

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

# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# Model service: http://localhost:8000 (placeholder)
```

## Development

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

# Frontend: http://localhost:3000
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