/**
 * Generate a unique message ID
 * Uses timestamp with optional offset for uniqueness
 */
export const generateMessageId = (offset = 0): string => {
  return (Date.now() + offset).toString();
};

/**
 * Message ID offset constants for different message types
 */
export const MESSAGE_ID_OFFSET = {
  USER: 0,
  ASSISTANT: 1,
  ERROR: 1,
} as const;
