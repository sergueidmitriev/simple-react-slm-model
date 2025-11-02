export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export { Theme } from './theme';
export { ApiError, ErrorType } from './errors';

export interface ChatResponse {
  message: string;
  success: boolean;
  error?: string;
}