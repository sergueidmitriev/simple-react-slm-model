export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export { Theme } from './theme';
export { ApiError, ErrorType } from './errors';

/**
 * Success response from chat API
 */
export interface ChatSuccessResponse {
  message: string;
  success: true;
}

/**
 * Error response from chat API
 */
export interface ChatErrorResponse {
  message?: string;
  success: false;
  error: string;
}

/**
 * Discriminated union for chat responses
 * Use success field to narrow the type
 */
export type ChatResponse = ChatSuccessResponse | ChatErrorResponse;

/**
 * Type guard to check if response is successful
 */
export const isChatSuccess = (response: ChatResponse): response is ChatSuccessResponse => {
  return response.success === true;
};