import { useState, useEffect } from 'react';
import { chatService } from '../services/api';

/**
 * Custom hook to check API health status
 * @returns boolean indicating if the API is connected
 */
export const useHealthCheck = (): boolean => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await chatService.health();
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
        console.error('API health check failed:', error);
      }
    };
    
    checkHealth();
  }, []);

  return isConnected;
};
