import React from 'react';
import { Theme } from '../types';

interface ChatContainerProps {
  theme: Theme;
  children: React.ReactNode;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ theme, children }) => {
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === Theme.Terminal 
        ? 'bg-black' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className={`w-full max-w-2xl overflow-hidden min-h-[600px] flex flex-col ${
        theme === Theme.Terminal
          ? 'bg-black border-2 border-green-500 rounded-none shadow-[0_0_20px_rgba(34,197,94,0.3)]'
          : 'bg-white rounded-2xl shadow-2xl'
      }`}>
        {children}
      </div>
    </div>
  );
};

export default ChatContainer;
