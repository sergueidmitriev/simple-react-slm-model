import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';
import ThemeToggle from './ThemeToggle';
import ConnectionStatus from './ConnectionStatus';

interface ChatHeaderProps {
  isConnected: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isConnected }) => {
  const { theme } = useTheme();
  
  const title = theme === Theme.Terminal ? '> SLM_TERMINAL' : 'SLM Chat Assistant';
  const subtitle = theme === Theme.Terminal ? 'SYSTEM v1.0.0 READY' : 'Powered by Small Language Model';

  return (
    <div className="chat-header">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {title}
          </h1>
          <p className="text-sm mt-1 opacity-90">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <ConnectionStatus isConnected={isConnected} />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
