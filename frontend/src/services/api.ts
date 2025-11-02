import axios from 'axios';
import { ChatResponse } from '../types';

// In development with Docker, use relative URL (Vite proxy will handle it)
// In production, use the full URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    try {
      const response = await api.post('/api/chat', { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  },

  health: async (): Promise<{ status: string }> => {
    try {
      const response = await api.get('/api/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('API is not available');
    }
  },
};