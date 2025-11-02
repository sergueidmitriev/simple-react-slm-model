import axios from 'axios';
import { ChatResponse } from '../types';
import { API_ENDPOINTS, API_CONFIG } from '../constants/api';
import { createApiError } from '../utils/errors';
import { retry } from '../utils/retry';

// In development with Docker, use relative URL (Vite proxy will handle it)
// In production, use the full URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error);
    return Promise.reject(error);
  }
);

export const chatService = {
  sendMessage: async (message: string, language?: string, signal?: AbortSignal): Promise<ChatResponse> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.CHAT, 
        { message, language }, 
        { signal }
      );
      const data = response.data as ChatResponse;
      
      // Validate response structure
      if (!data || typeof data.success !== 'boolean') {
        throw new Error('Invalid response format from API');
      }
      
      return data;
    } catch (error) {
      // Don't log errors for aborted requests
      if (signal?.aborted) {
        throw error;
      }
      const apiError = createApiError(error);
      console.error('Error sending message:', apiError);
      throw apiError;
    }
  },

  streamMessage: async (
    message: string, 
    language?: string, 
    onChunk?: (chunk: string) => void,
    signal?: AbortSignal
  ): Promise<void> => {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.CHAT}/stream`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, language }),
        signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        // Decode and add to buffer
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete SSE messages
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove 'data: ' prefix
            
            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.chunk && onChunk) {
                onChunk(parsed.chunk);
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (parseError) {
              console.warn('Failed to parse SSE data:', parseError);
            }
          }
        }
      }
    } catch (error) {
      // Don't log errors for aborted requests
      if (signal?.aborted) {
        throw error;
      }
      const apiError = createApiError(error);
      console.error('Error streaming message:', apiError);
      throw apiError;
    }
  },

  health: async (signal?: AbortSignal): Promise<{ status: string }> => {
    try {
      const response = await retry(
        () => api.get(API_ENDPOINTS.HEALTH, { signal }),
        {
          maxAttempts: 3,
          delayMs: 1000,
          onRetry: (attempt, error) => {
            if (!signal?.aborted) {
              console.log(`Health check attempt ${attempt} failed:`, error.message);
            }
          },
        }
      );
      return response.data;
    } catch (error) {
      // Don't log errors for aborted requests
      if (signal?.aborted) {
        throw error;
      }
      const apiError = createApiError(error);
      console.error('Health check failed:', apiError);
      throw apiError;
    }
  },
};