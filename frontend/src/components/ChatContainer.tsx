import React from 'react';
import { Theme } from '../types';
import { getThemeClasses, cn } from '../utils/themeStyles';

interface ChatContainerProps {
  theme: Theme;
  children: React.ReactNode;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ theme, children }) => {
  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center p-4',
      getThemeClasses(theme, {
        modern: 'bg-gradient-to-br from-blue-50 to-indigo-100',
        terminal: 'bg-black'
      })
    )}>
      <div className={cn(
        'w-full max-w-2xl overflow-hidden min-h-[600px] flex flex-col',
        getThemeClasses(theme, {
          modern: 'bg-white rounded-2xl shadow-2xl',
          terminal: 'bg-black border-2 border-green-500 rounded-none shadow-[0_0_20px_rgba(34,197,94,0.3)]'
        })
      )}>
        {children}
      </div>
    </div>
  );
};

export default ChatContainer;
