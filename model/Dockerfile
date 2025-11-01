# Model service placeholder Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements (placeholder)
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# Copy model files (will be added later)
# COPY . .

# Expose port for model API
EXPOSE 8000

# Placeholder command
CMD ["python", "-c", "print('Model service placeholder - to be implemented')"]