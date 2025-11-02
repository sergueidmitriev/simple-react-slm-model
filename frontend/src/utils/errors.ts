import { ApiError, ErrorType } from '../types/errors';

/**
 * Create a typed ApiError from any error object
 * Handles Axios errors, timeout errors, and generic errors
 */
export const createApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  // Handle Axios errors
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
    const statusCode = axiosError.response?.status;
    const message = axiosError.response?.data?.message || axiosError.message || 'API request failed';

    if (statusCode) {
      if (statusCode >= 500) {
        return new ApiError(message, ErrorType.API, statusCode, error);
      }
      if (statusCode >= 400) {
        return new ApiError(message, ErrorType.VALIDATION, statusCode, error);
      }
    }

    return new ApiError(message, ErrorType.NETWORK, statusCode, error);
  }

  // Handle timeout errors
  if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNABORTED') {
    return new ApiError('Request timeout', ErrorType.TIMEOUT, undefined, error);
  }

  // Generic error
  const message = error instanceof Error ? error.message : 'An unknown error occurred';
  return new ApiError(message, ErrorType.UNKNOWN, undefined, error);
};
