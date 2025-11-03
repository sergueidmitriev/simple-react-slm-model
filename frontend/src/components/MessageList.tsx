import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';
import { Message } from '../types';
import MessageComponent from './Message';
import { ChatIcon } from './icons';

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

  const emptyTitle = theme === Theme.Terminal 
    ? t('chat.emptyTitleTerminal') 
    : t('chat.emptyTitle');

  const emptySubtitle = theme === Theme.Terminal 
    ? t('chat.emptySubtitleTerminal') 
    : t('chat.emptySubtitle');

  const loadingText = theme === Theme.Terminal 
    ? t('chat.aiTypingTerminal') 
    : t('chat.aiTyping');

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ChatIcon />
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
