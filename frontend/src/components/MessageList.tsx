import { useRef, useEffect } from 'react';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import { Message } from '../types';
import MessageComponent from './Message';
import { ChatIcon } from './icons';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { tt } = useThemedTranslation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ChatIcon />
          </div>
          <h3 className="empty-state-title">
            {tt('chat.emptyTitle')}
          </h3>
          <p className="empty-state-subtitle">
            {tt('chat.emptySubtitle')}
          </p>
        </div>
      ) : (
        messages.map(message => (
          <MessageComponent key={message.id} message={message} />
        ))
      )}
      
      {isLoading && (
        <div className="loading-indicator">
          <div>
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
            <span className="loading-text">{tt('chat.aiTyping')}</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
