#!/bin/bash
# Interactive chat with the model

# Get the actual container name (supports both underscore and hyphen formats)
CONTAINER_NAME=$(docker ps --format "{{.Names}}" | grep -E "model[_-]1")

echo "💬 Starting interactive chat with Qwen2.5-3B..."
echo "📦 Using container: $CONTAINER_NAME"
echo ""
echo "Type your questions (press Ctrl+D to exit)"
echo "Try both English and French! 🇬🇧 🇫🇷"
echo ""
echo "Examples:"
echo "  - What is React?"
echo "  - Qu'est-ce que TypeScript?"
echo "  - Tell me about Docker"
echo "  - Explique-moi le machine learning"
echo ""
echo "---"
echo ""

docker exec -it $CONTAINER_NAME ollama run qwen2.5:3b
