import axios from 'axios';
import { ChatResponse } from '../types';
import { API_ENDPOINTS, API_CONFIG } from '../constants/api';

// In development with Docker, use relative URL (Vite proxy will handle it)
// In production, use the full URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

export const chatService = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    try {
      const response = await api.post(API_ENDPOINTS.CHAT, { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  },

  health: async (): Promise<{ status: string }> => {
    try {
      const response = await api.get(API_ENDPOINTS.HEALTH);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('API is not available');
    }
  },
};