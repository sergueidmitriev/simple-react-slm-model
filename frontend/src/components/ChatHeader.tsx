import React from 'react';
import { Theme } from '../types';
import ThemeToggle from './ThemeToggle';
import ConnectionStatus from './ConnectionStatus';

interface ChatHeaderProps {
  theme: Theme;
  isConnected: boolean;
  onThemeToggle: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ theme, isConnected, onThemeToggle }) => {
  return (
    <div className={`p-6 ${
      theme === Theme.Terminal
        ? 'bg-black border-b-2 border-green-500'
        : 'bg-gradient-to-r from-blue-600 to-indigo-600'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${
            theme === Theme.Terminal ? 'text-green-500 font-mono' : 'text-white'
          }`}>
            {theme === Theme.Terminal ? '> SLM_TERMINAL' : 'SLM Chat Assistant'}
          </h1>
          <p className={`text-sm mt-1 ${
            theme === Theme.Terminal ? 'text-green-400 font-mono' : 'text-blue-100'
          }`}>
            {theme === Theme.Terminal ? 'SYSTEM v1.0.0 READY' : 'Powered by Small Language Model'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          <ConnectionStatus isConnected={isConnected} theme={theme} />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
