import React, { useRef, useEffect } from 'react';
import { Message, Theme } from '../types';
import MessageComponent from './Message';

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

  return (
    <div className={`flex-1 overflow-y-auto p-6 space-y-4 min-h-0 ${
      theme === Theme.Terminal ? 'bg-black' : 'bg-gray-50'
    }`}>
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className={`rounded-full p-3 mb-3 ${
            theme === Theme.Terminal ? 'bg-green-950 border border-green-500' : 'bg-blue-50'
          }`}>
            <svg className={`w-6 h-6 ${
              theme === Theme.Terminal ? 'text-green-500' : 'text-blue-500'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </div>
          <h3 className={`text-lg font-medium mb-1 ${
            theme === Theme.Terminal ? 'text-green-500 font-mono' : 'text-gray-700'
          }`}>
            {theme === Theme.Terminal ? '> AWAITING INPUT_' : 'Start a conversation'}
          </h3>
          <p className={`text-sm ${
            theme === Theme.Terminal ? 'text-green-400 font-mono' : 'text-gray-500'
          }`}>
            {theme === Theme.Terminal ? 'Type command below...' : 'Send a message to begin chatting'}
          </p>
        </div>
      ) : (
        messages.map(message => (
          <MessageComponent key={message.id} message={message} theme={theme} />
        ))
      )}
      
      {isLoading && (
        <div className="flex justify-start mb-4">
          <div className={`rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm max-w-xs ${
            theme === Theme.Terminal
              ? 'bg-green-950 border border-green-500'
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  theme === Theme.Terminal ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  theme === Theme.Terminal ? 'bg-green-500' : 'bg-blue-500'
                }`} style={{ animationDelay: '0.1s' }}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  theme === Theme.Terminal ? 'bg-green-500' : 'bg-blue-500'
                }`} style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className={`text-xs ${
                theme === Theme.Terminal ? 'text-green-500 font-mono' : 'text-gray-500'
              }`}>
                {theme === Theme.Terminal ? 'PROCESSING...' : 'AI is typing...'}
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
