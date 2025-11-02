import React from 'react';
import { Message } from '../types';

interface MessageProps {
  message: Message;
  theme: 'modern' | 'terminal';
}

const MessageComponent: React.FC<MessageProps> = ({ message, theme }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 shadow-sm ${
        theme === 'terminal'
          ? isUser
            ? 'bg-green-950 border-2 border-green-500 text-green-400 font-mono'
            : 'bg-black border-2 border-green-600 text-green-500 font-mono'
          : isUser 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-sm' 
            : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-sm'
      }`}>
        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
          theme === 'terminal' ? 'font-mono' : ''
        }`}>
          {theme === 'terminal' && !isUser && '> '}
          {message.content}
        </p>
        <p className={`text-xs mt-2 ${
          theme === 'terminal'
            ? 'text-green-600 font-mono'
            : isUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {theme === 'terminal' ? '[' : ''}
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
          {theme === 'terminal' ? ']' : ''}
        </p>
      </div>
    </div>
  );
};

export default MessageComponent;