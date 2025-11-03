import { useThemedTranslation } from '../hooks/useThemedTranslation';
import { SendIcon, AlertIcon } from './icons';

interface MessageInputProps {
  inputRef: React.RefObject<HTMLInputElement>;
  value: string;
  isLoading: boolean;
  isCancelled: boolean;
  isConnected: boolean;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const MessageInput = ({
  inputRef,
  value,
  isLoading,
  isCancelled,
  isConnected,
  onChange,
  onSubmit,
  onCancel,
}: MessageInputProps) => {
  const { tt } = useThemedTranslation();

  return (
    <div className="message-input-container">
      <form onSubmit={onSubmit} className="flex space-x-3" role="search" aria-label={tt('chat.inputLabel')}>
        <div className="flex-1 relative">
          <label htmlFor="message-input" className="sr-only">
            {tt('chat.inputLabel')}
          </label>
          <input
            id="message-input"
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={tt('chat.inputPlaceholder')}
            className="chat-input"
            disabled={isLoading || !isConnected}
            aria-label={tt('chat.inputPlaceholder')}
            aria-describedby={!isConnected ? 'connection-error' : undefined}
          />
          {value.trim() && !isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-live="polite" aria-atomic="true">
              <span className="text-xs opacity-50" aria-label={`${value.length} characters`}>
                {value.length}
              </span>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <button
            type="button"
            onClick={onCancel}
            className="chat-button-cancel"
            aria-label={tt('chat.cancelButton')}
          >
            <span aria-hidden="true">✕</span>
            <span>{tt('chat.cancelButton')}</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!isConnected || !value.trim()}
            className="chat-button"
            aria-label={tt('chat.sendButton')}
            aria-disabled={!isConnected || !value.trim()}
          >
            <SendIcon aria-hidden="true" />
            <span>{isLoading ? tt('chat.sending') : tt('chat.sendButton')}</span>
          </button>
        )}
      </form>
      
      {!isConnected && (
        <div className="error-message" role="alert" aria-live="assertive" id="connection-error">
          <AlertIcon className="w-4 h-4 text-red-500" aria-hidden="true" />
          <span className="text-sm">
            {tt('errors.connectionLost')}
          </span>
        </div>
      )}
      
      {isCancelled && (
        <div className="cancel-message" role="status" aria-live="polite">
          <span className="text-sm">
            {tt('chat.requestCancelled')}
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
