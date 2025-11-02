import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';

interface MessageInputProps {
  value: string;
  isLoading: boolean;
  isConnected: boolean;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  isLoading,
  isConnected,
  onChange,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Memoize computed strings to prevent recalculation
  const placeholder = useMemo(
    () => theme === Theme.Terminal ? t('chat.inputPlaceholderTerminal') : t('chat.inputPlaceholder'),
    [theme, t]
  );

  const buttonText = useMemo(
    () => theme === Theme.Terminal 
      ? t('chat.sendButtonTerminal')
      : (isLoading ? t('chat.sending') : t('chat.sendButton')),
    [theme, isLoading, t]
  );

  const errorMessage = useMemo(
    () => theme === Theme.Terminal 
      ? t('errors.connectionLostTerminal')
      : t('errors.connectionLost'),
    [theme, t]
  );

  return (
    <div className="message-input-container">
      <form onSubmit={onSubmit} className="flex space-x-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="chat-input"
            disabled={isLoading || !isConnected}
          />
          {value.trim() && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-xs opacity-50">
                {value.length}
              </span>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !isConnected || !value.trim()}
          className="chat-button"
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
        <div className="error-message">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">
            {errorMessage}
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
