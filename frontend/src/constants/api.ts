/**
 * API endpoint constants
 */
export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  HEALTH: '/api/health',
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;
