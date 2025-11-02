import React from 'react';
import { Message, Theme } from '../types';
import { getThemeClasses, cn, isTerminal } from '../utils/themeStyles';

interface MessageProps {
  message: Message;
  theme: Theme;
}

const MessageComponent: React.FC<MessageProps> = ({ message, theme }) => {
  const isUser = message.role === 'user';
  
  const bubbleStyles = isUser
    ? getThemeClasses(theme, {
        modern: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-sm',
        terminal: 'bg-green-950 border-2 border-green-500 text-green-400 font-mono'
      })
    : getThemeClasses(theme, {
        modern: 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-sm',
        terminal: 'bg-black border-2 border-green-600 text-green-500 font-mono'
      });

  const timestampStyles = getThemeClasses(theme, {
    modern: isUser ? 'text-blue-100' : 'text-gray-500',
    terminal: 'text-green-600 font-mono'
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={cn('max-w-xs lg:max-w-md px-4 py-3 shadow-sm', bubbleStyles)}>
        <p className={cn(
          'text-sm leading-relaxed whitespace-pre-wrap',
          isTerminal(theme) && 'font-mono'
        )}>
          {isTerminal(theme) && !isUser && '> '}
          {message.content}
        </p>
        <p className={cn('text-xs mt-2', timestampStyles)}>
          {isTerminal(theme) && '['}
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
          {isTerminal(theme) && ']'}
        </p>
      </div>
    </div>
  );
};

export default MessageComponent;