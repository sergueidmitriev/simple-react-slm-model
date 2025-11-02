#!/bin/bash
# Test script for the Ollama model

set -e

# Get the actual container name (supports both underscore and hyphen formats)
CONTAINER_NAME=$(docker ps --format "{{.Names}}" | grep -E "model[_-]1")

echo "🧪 Testing Qwen2.5-3B model..."
echo "📦 Using container: $CONTAINER_NAME"
echo ""

# Test 1: English
echo "📝 Test 1: English question"
echo "Question: What is the capital of France?"
echo ""
docker exec $CONTAINER_NAME ollama run qwen2.5:3b "What is the capital of France? Answer in one sentence."

echo ""
echo "---"
echo ""

# Test 2: French
echo "📝 Test 2: French question"
echo "Question: Quelle est la capitale de la France?"
echo ""
docker exec $CONTAINER_NAME ollama run qwen2.5:3b "Quelle est la capitale de la France? Réponds en une phrase."

echo ""
echo "---"
echo ""

# Test 3: API test
echo "📝 Test 3: Testing REST API"
echo ""
curl -s http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:3b",
  "prompt": "Hello! Respond with just \"API working!\"",
  "stream": false
}' | jq -r '.response'

echo ""
echo ""
echo "✅ All tests completed!"
echo ""
echo "💡 To interact with the model:"
echo "  docker exec -it $CONTAINER_NAME ollama run qwen2.5:3b"
echo ""
echo "💡 To test bilingual capability:"
echo "  English: docker exec $CONTAINER_NAME ollama run qwen2.5:3b \"Tell me a fun fact\""
echo "  French:  docker exec $CONTAINER_NAME ollama run qwen2.5:3b \"Dis-moi un fait amusant\""
