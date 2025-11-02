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

export class ApiError extends Error {
  constructor(
    message: string,
    public type: ErrorType,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
