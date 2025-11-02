/**
 * Custom error types for better error handling
 */

export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  VALIDATION = 'VALIDATION',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Custom API error class with additional context
 */
export class ApiError extends Error {
  readonly name = 'ApiError';
  
  constructor(
    message: string,
    public readonly type: ErrorType,
    public readonly statusCode?: number,
    public readonly originalError?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Check if error is a specific type
   */
  isType(type: ErrorType): boolean {
    return this.type === type;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    switch (this.type) {
      case ErrorType.NETWORK:
        return 'Network connection error. Please check your internet connection.';
      case ErrorType.TIMEOUT:
        return 'Request timed out. Please try again.';
      case ErrorType.VALIDATION:
        return this.message || 'Invalid request. Please check your input.';
      case ErrorType.API:
        return 'Server error. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}
