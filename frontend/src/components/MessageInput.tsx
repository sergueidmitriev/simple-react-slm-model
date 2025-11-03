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
      <form onSubmit={onSubmit} className="flex space-x-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={tt('chat.inputPlaceholder')}
            className="chat-input"
            disabled={isLoading || !isConnected}
          />
          {value.trim() && !isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-xs opacity-50">
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
          >
            <span>✕</span>
            <span>{tt('chat.cancelButton')}</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!isConnected || !value.trim()}
            className="chat-button"
          >
            <SendIcon />
            <span>{isLoading ? tt('chat.sending') : tt('chat.sendButton')}</span>
          </button>
        )}
      </form>
      
      {!isConnected && (
        <div className="error-message">
          <AlertIcon className="w-4 h-4 text-red-500" />
          <span className="text-sm">
            {tt('errors.connectionLost')}
          </span>
        </div>
      )}
      
      {isCancelled && (
        <div className="cancel-message">
          <span className="text-sm">
            {tt('chat.requestCancelled')}
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
