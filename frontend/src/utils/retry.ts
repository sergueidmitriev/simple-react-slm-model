/**
 * Retry utility for failed async operations
 */

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  delayMs: 1000,
  backoff: true,
  onRetry: () => {},
};

/**
 * Retry an async operation with exponential backoff
 * @param fn - The async function to retry
 * @param options - Retry configuration
 * @returns Promise that resolves with the function result or rejects after all attempts fail
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < config.maxAttempts) {
        config.onRetry(attempt, lastError);

        const delay = config.backoff
          ? config.delayMs * Math.pow(2, attempt - 1)
          : config.delayMs;

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
