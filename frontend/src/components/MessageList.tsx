import { useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';
import { Message } from '../types';
import MessageComponent from './Message';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Memoize computed values to prevent recalculation on every render
  const emptyTitle = useMemo(
    () => theme === Theme.Terminal ? t('chat.emptyTitleTerminal') : t('chat.emptyTitle'),
    [theme, t]
  );

  const emptySubtitle = useMemo(
    () => theme === Theme.Terminal ? t('chat.emptySubtitleTerminal') : t('chat.emptySubtitle'),
    [theme, t]
  );

  const loadingText = useMemo(
    () => theme === Theme.Terminal ? t('chat.aiTypingTerminal') : t('chat.aiTyping'),
    [theme, t]
  );

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </div>
          <h3 className="empty-state-title">
            {emptyTitle}
          </h3>
          <p className="empty-state-subtitle">
            {emptySubtitle}
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
            <span className="loading-text">{loadingText}</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
