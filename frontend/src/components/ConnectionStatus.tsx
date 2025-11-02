import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';

interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  const { theme } = useTheme();
  
  const tooltipText = isConnected 
    ? 'Backend API is connected and ready to process messages'
    : 'Backend API connection failed. Check if the server is running.';

  const statusText = isConnected 
    ? (theme === Theme.Terminal ? '[ONLINE]' : 'Online') 
    : 'Offline';

  return (
    <div className="status-indicator tooltip-trigger">
      <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
      <span className="text-sm font-medium">
        {statusText}
      </span>
      <div className="tooltip">
        {tooltipText}
      </div>
    </div>
  );
};

export default ConnectionStatus;
