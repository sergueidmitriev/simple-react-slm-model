import React from 'react';
import { Theme } from '../types';
import { getThemeClasses, cn, isTerminal } from '../utils/themeStyles';

interface ConnectionStatusProps {
  isConnected: boolean;
  theme: Theme;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected, theme }) => {
  const tooltipText = isConnected 
    ? 'Backend API is connected and ready to process messages'
    : 'Backend API connection failed. Check if the server is running.';

  const statusText = isConnected 
    ? (isTerminal(theme) ? '[ONLINE]' : 'Online') 
    : 'Offline';

  return (
    <div className="relative group flex items-center space-x-2">
      <div
        className={cn(
          'w-3 h-3 rounded-full shadow-lg',
          isConnected 
            ? getThemeClasses(theme, { modern: 'bg-green-400', terminal: 'bg-green-500' })
            : 'bg-red-400'
        )}
      />
      <span className={cn(
        'text-sm font-medium',
        getThemeClasses(theme, {
          modern: 'text-white',
          terminal: 'text-green-500 font-mono'
        })
      )}>
        {statusText}
      </span>
      
      {/* Tooltip */}
      <div className={cn(
        'absolute bottom-full right-0 mb-2 px-3 py-2 text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap pointer-events-none z-10',
        getThemeClasses(theme, {
          modern: 'bg-gray-900 text-white shadow-lg',
          terminal: 'bg-green-950 border border-green-500 text-green-400 font-mono shadow-[0_0_10px_rgba(34,197,94,0.3)]'
        })
      )}>
        {tooltipText}
        <div className={cn(
          'absolute top-full right-4 w-2 h-2 transform rotate-45 -mt-1',
          getThemeClasses(theme, {
            modern: 'bg-gray-900',
            terminal: 'bg-green-950 border-r border-b border-green-500'
          })
        )} />
      </div>
    </div>
  );
};

export default ConnectionStatus;
