import React from 'react';
import { Theme } from '../types';

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
  return (
    <div className={`p-6 border-t ${
      theme === Theme.Terminal
        ? 'bg-black border-green-500'
        : 'bg-white border-gray-200'
    }`}>
      <form onSubmit={onSubmit} className="flex space-x-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={theme === Theme.Terminal ? '> Enter command...' : 'Type your message here...'}
            className={`w-full px-4 py-3 pr-12 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === Theme.Terminal
                ? 'bg-black border-2 border-green-500 text-green-500 font-mono placeholder-green-700 focus:border-green-400 focus:shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                : 'border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            }`}
            disabled={isLoading || !isConnected}
          />
          {value.trim() && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className={`text-xs ${
                theme === Theme.Terminal ? 'text-green-600 font-mono' : 'text-gray-400'
              }`}>
                {value.length}
              </span>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !isConnected || !value.trim()}
          className={`px-6 py-3 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 ${
            theme === Theme.Terminal
              ? 'bg-green-950 border-2 border-green-500 text-green-500 font-mono hover:bg-green-900 focus:shadow-[0_0_10px_rgba(34,197,94,0.5)]'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 shadow-lg'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{theme === Theme.Terminal ? 'SEND' : 'Sending'}</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>{theme === Theme.Terminal ? 'SEND' : 'Send'}</span>
            </>
          )}
        </button>
      </form>
      
      {!isConnected && (
        <div className={`mt-3 p-3 rounded-lg ${
          theme === Theme.Terminal
            ? 'bg-red-950 border border-red-500'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            <svg className={`w-4 h-4 ${
              theme === Theme.Terminal ? 'text-red-500' : 'text-red-500'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`text-sm ${
              theme === Theme.Terminal ? 'text-red-500 font-mono' : 'text-red-700'
            }`}>
              {theme === Theme.Terminal ? 'ERROR: CONNECTION_LOST' : 'Connection lost. Please check your network and try again.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
