# Simple React SLM Model - Makefile
# Usage: make <command>

.PHONY: help dev build up down logs clean install check

# Default target
help:
	@echo "Simple React SLM Model - Available Commands"
	@echo "=========================================="
	@echo ""
	@echo "Commands:"
	@echo "  dev      - Start development environment with hot reload"
	@echo "  build    - Build all services for production"
	@echo "  build-frontend - Build only frontend service"
	@echo "  build-backend  - Build only backend service"
	@echo "  up       - Start production environment"
	@echo "  down     - Stop all services"
	@echo "  logs     - Show logs from all services"
	@echo "  clean    - Clean up Docker images and containers"
	@echo "  install  - Install dependencies locally"
	@echo "  check    - Check if Docker and Docker Compose are installed"
	@echo ""
	@echo "Frontend-specific:"
	@echo "  frontend-dev     - Start frontend dev server (local)"
	@echo "  frontend-build   - Build frontend (local)"
	@echo "  frontend-preview - Preview built frontend"
	@echo "  frontend-lint    - Lint frontend code"
	@echo ""
	@echo "Examples:"
	@echo "  make dev     # Start development"
	@echo "  make up      # Start production"
	@echo "  make logs    # View logs"
	@echo "  make down    # Stop services"
	@echo ""

# Check if docker and docker-compose are installed
check:
	@echo "Checking requirements..."
	@command -v docker >/dev/null 2>&1 || { echo "Error: Docker is not installed"; exit 1; }
	@command -v docker-compose >/dev/null 2>&1 || { echo "Error: Docker Compose is not installed"; exit 1; }
	@echo "✅ Docker and Docker Compose are installed"

# Development environment with hot reload
dev: check
	@echo "Starting development environment..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Development with rebuild (no cache)
dev-fresh: check
	@echo "Starting development environment with fresh build..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Build production images
build: check
	@echo "Building production images..."
	docker-compose build

# Build only frontend
build-frontend: check
	@echo "Building frontend only..."
	docker-compose build frontend

# Build only backend
build-backend: check
	@echo "Building backend only..."
	docker-compose build backend

# Start production environment
up: check
	@echo "Starting production environment..."
	docker-compose up --build -d
	@echo ""
	@echo "🎉 Services started successfully!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend API: http://localhost:3001"
	@echo "Model service: http://localhost:8000"
	@echo ""
	@echo "Use 'make logs' to view logs or 'make down' to stop services"

# Stop all services
down:
	@echo "Stopping all services..."
	docker-compose down

# Show logs from all services
logs:
	docker-compose logs -f

# Clean up Docker resources
clean:
	@echo "Cleaning up Docker resources..."
	docker-compose down -v
	docker system prune -f
	@echo "✅ Cleanup completed!"

# Install dependencies locally (for development without Docker)
install:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Installing backend dependencies..."
	cd backend && npm install
	@echo "✅ Dependencies installed!"

# Quick development setup
dev-setup: install
	@echo "Setting up development environment..."
	@cp .env.example .env 2>/dev/null || echo ".env already exists"
	@echo "✅ Development setup completed!"
	@echo ""
	@echo "You can now run:"
	@echo "  make dev    # Start with Docker"
	@echo "  Or run locally:"
	@echo "  cd frontend && npm run dev"
	@echo "  cd backend && npm run dev"

# Start services in background
up-bg: check
	@echo "Starting services in background..."
	docker-compose up --build -d

# Restart specific service
restart-frontend:
	docker-compose restart frontend

restart-backend:
	docker-compose restart backend

restart-model:
	docker-compose restart model

# View status of services
status:
	docker-compose ps

# Pull latest images
pull:
	docker-compose pull

# Frontend-specific commands
frontend-dev:
	@echo "Starting frontend development server..."
	cd frontend && npm run dev

frontend-build:
	@echo "Building frontend locally..."
	cd frontend && npm run build

frontend-preview:
	@echo "Starting frontend preview server..."
	cd frontend && npm run preview

frontend-lint:
	@echo "Linting frontend code..."
	cd frontend && npm run lint

# Test API connectivity
test-api:
	@echo "Testing API connectivity..."
	@curl -f http://localhost:3001/api/health || echo "❌ Backend API not accessible at http://localhost:3001"