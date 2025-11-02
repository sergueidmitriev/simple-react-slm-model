import React from 'react';
import { Theme } from '../types';
import ThemeToggle from './ThemeToggle';
import ConnectionStatus from './ConnectionStatus';
import { getThemeClasses, cn, isTerminal } from '../utils/themeStyles';

interface ChatHeaderProps {
  theme: Theme;
  isConnected: boolean;
  onThemeToggle: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ theme, isConnected, onThemeToggle }) => {
  const title = isTerminal(theme) ? '> SLM_TERMINAL' : 'SLM Chat Assistant';
  const subtitle = isTerminal(theme) ? 'SYSTEM v1.0.0 READY' : 'Powered by Small Language Model';

  return (
    <div className={cn(
      'p-6',
      getThemeClasses(theme, {
        modern: 'bg-gradient-to-r from-blue-600 to-indigo-600',
        terminal: 'bg-black border-b-2 border-green-500'
      })
    )}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn(
            'text-2xl font-bold',
            getThemeClasses(theme, {
              modern: 'text-white',
              terminal: 'text-green-500 font-mono'
            })
          )}>
            {title}
          </h1>
          <p className={cn(
            'text-sm mt-1',
            getThemeClasses(theme, {
              modern: 'text-blue-100',
              terminal: 'text-green-400 font-mono'
            })
          )}>
            {subtitle}
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
