import React, { useRef, useEffect } from 'react';
import { Message, Theme } from '../types';
import MessageComponent from './Message';
import { getThemeClasses, cn, isTerminal } from '../utils/themeStyles';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  theme: Theme;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, theme }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const emptyTitle = isTerminal(theme) ? '> AWAITING INPUT_' : 'Start a conversation';
  const emptySubtitle = isTerminal(theme) ? 'Type command below...' : 'Send a message to begin chatting';
  const loadingText = isTerminal(theme) ? 'PROCESSING...' : 'AI is typing...';

  return (
    <div className={cn(
      'flex-1 overflow-y-auto p-6 space-y-4 min-h-0',
      getThemeClasses(theme, {
        modern: 'bg-gray-50',
        terminal: 'bg-black'
      })
    )}>
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className={cn(
            'rounded-full p-3 mb-3',
            getThemeClasses(theme, {
              modern: 'bg-blue-50',
              terminal: 'bg-green-950 border border-green-500'
            })
          )}>
            <svg className={cn(
              'w-6 h-6',
              getThemeClasses(theme, {
                modern: 'text-blue-500',
                terminal: 'text-green-500'
              })
            )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </div>
          <h3 className={cn(
            'text-lg font-medium mb-1',
            getThemeClasses(theme, {
              modern: 'text-gray-700',
              terminal: 'text-green-500 font-mono'
            })
          )}>
            {emptyTitle}
          </h3>
          <p className={cn(
            'text-sm',
            getThemeClasses(theme, {
              modern: 'text-gray-500',
              terminal: 'text-green-400 font-mono'
            })
          )}>
            {emptySubtitle}
          </p>
        </div>
      ) : (
        messages.map(message => (
          <MessageComponent key={message.id} message={message} theme={theme} />
        ))
      )}
      
      {isLoading && (
        <div className="flex justify-start mb-4">
          <div className={cn(
            'rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm max-w-xs',
            getThemeClasses(theme, {
              modern: 'bg-white border border-gray-200',
              terminal: 'bg-green-950 border border-green-500'
            })
          )}>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className={cn(
                  'w-2 h-2 rounded-full animate-bounce',
                  getThemeClasses(theme, {
                    modern: 'bg-blue-500',
                    terminal: 'bg-green-500'
                  })
                )}></div>
                <div className={cn(
                  'w-2 h-2 rounded-full animate-bounce',
                  getThemeClasses(theme, {
                    modern: 'bg-blue-500',
                    terminal: 'bg-green-500'
                  })
                )} style={{ animationDelay: '0.1s' }}></div>
                <div className={cn(
                  'w-2 h-2 rounded-full animate-bounce',
                  getThemeClasses(theme, {
                    modern: 'bg-blue-500',
                    terminal: 'bg-green-500'
                  })
                )} style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className={cn(
                'text-xs',
                getThemeClasses(theme, {
                  modern: 'text-gray-500',
                  terminal: 'text-green-500 font-mono'
                })
              )}>
                {loadingText}
              </span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
