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
  sendMessage: async (message: string, signal?: AbortSignal): Promise<ChatResponse> => {
    try {
      const response = await api.post(API_ENDPOINTS.CHAT, { message }, { signal });
      return response.data;
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