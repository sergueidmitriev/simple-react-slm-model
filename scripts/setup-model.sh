#!/bin/bash
# Setup script to pull and test the Ollama model

set -e

echo "🚀 Setting up Qwen2.5-3B model with Ollama..."
echo ""

# Check if Ollama container is running
if ! docker ps | grep -q ollama; then
    echo "❌ Ollama container is not running!"
    echo "Please start it first with: make dev"
    exit 1
fi

echo "✅ Ollama container is running"
echo ""

# Get the actual container name (supports both underscore and hyphen formats)
CONTAINER_NAME=$(docker ps --format "{{.Names}}" | grep -E "model[_-]1")
echo "📦 Using container: $CONTAINER_NAME"
echo ""

# Pull the model
echo "📥 Pulling Qwen2.5-3B model (this may take a few minutes)..."
docker exec -it $CONTAINER_NAME ollama pull qwen2.5:3b

echo ""
echo "✅ Model downloaded successfully!"
echo ""

# List available models
echo "📋 Available models:"
docker exec -it $CONTAINER_NAME ollama list

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Test the model with:"
echo "  ./scripts/test-model.sh"
echo ""
echo "Or interact directly:"
echo "  docker exec -it $CONTAINER_NAME ollama run qwen2.5:3b"
