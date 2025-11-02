import { useState, useEffect } from 'react';
import { chatService } from '../services/api';

/**
 * Custom hook to check API health status
 * @returns boolean indicating if the API is connected
 */
export const useHealthCheck = (): boolean => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    const checkHealth = async () => {
      try {
        await chatService.health(abortController.signal);
        if (!abortController.signal.aborted) {
          setIsConnected(true);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          setIsConnected(false);
          console.error('API health check failed:', error);
        }
      }
    };
    
    checkHealth();

    // Cleanup function to cancel request if component unmounts
    return () => {
      abortController.abort();
    };
  }, []);

  return isConnected;
};
