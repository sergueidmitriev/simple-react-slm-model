import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';
import { SendIcon, SpinnerIcon, AlertIcon } from './icons';

interface MessageInputProps {
  value: string;
  isLoading: boolean;
  isConnected: boolean;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const MessageInput = ({
  value,
  isLoading,
  isConnected,
  onChange,
  onSubmit,
}: MessageInputProps) => {
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
              <SpinnerIcon />
              <span>{buttonText}</span>
            </>
          ) : (
            <>
              <SendIcon />
              <span>{buttonText}</span>
            </>
          )}
        </button>
      </form>
      
      {!isConnected && (
        <div className="error-message">
          <AlertIcon className="w-4 h-4 text-red-500" />
          <span className="text-sm">
            {errorMessage}
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
