import React from 'react';
import { Theme } from '../types';
import { getThemeClasses, cn, isTerminal } from '../utils/themeStyles';

interface MessageInputProps {
  value: string;
  isLoading: boolean;
  isConnected: boolean;
  theme: Theme;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  isLoading,
  isConnected,
  theme,
  onChange,
  onSubmit,
}) => {
  const placeholder = isTerminal(theme) ? '> Enter command...' : 'Type your message here...';
  const buttonText = isTerminal(theme) ? 'SEND' : (isLoading ? 'Sending' : 'Send');
  const errorMessage = isTerminal(theme) 
    ? 'ERROR: CONNECTION_LOST' 
    : 'Connection lost. Please check your network and try again.';

  return (
    <div className={cn(
      'p-6 border-t',
      getThemeClasses(theme, {
        modern: 'bg-white border-gray-200',
        terminal: 'bg-black border-green-500'
      })
    )}>
      <form onSubmit={onSubmit} className="flex space-x-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'w-full px-4 py-3 pr-12 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
              getThemeClasses(theme, {
                modern: 'border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
                terminal: 'bg-black border-2 border-green-500 text-green-500 font-mono placeholder-green-700 focus:border-green-400 focus:shadow-[0_0_10px_rgba(34,197,94,0.3)]'
              })
            )}
            disabled={isLoading || !isConnected}
          />
          {value.trim() && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className={cn(
                'text-xs',
                getThemeClasses(theme, {
                  modern: 'text-gray-400',
                  terminal: 'text-green-600 font-mono'
                })
              )}>
                {value.length}
              </span>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !isConnected || !value.trim()}
          className={cn(
            'px-6 py-3 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2',
            getThemeClasses(theme, {
              modern: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 shadow-lg',
              terminal: 'bg-green-950 border-2 border-green-500 text-green-500 font-mono hover:bg-green-900 focus:shadow-[0_0_10px_rgba(34,197,94,0.5)]'
            })
          )}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{buttonText}</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>{buttonText}</span>
            </>
          )}
        </button>
      </form>
      
      {!isConnected && (
        <div className={cn(
          'mt-3 p-3 rounded-lg',
          getThemeClasses(theme, {
            modern: 'bg-red-50 border border-red-200',
            terminal: 'bg-red-950 border border-red-500'
          })
        )}>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={cn(
              'text-sm',
              getThemeClasses(theme, {
                modern: 'text-red-700',
                terminal: 'text-red-500 font-mono'
              })
            )}>
              {errorMessage}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
