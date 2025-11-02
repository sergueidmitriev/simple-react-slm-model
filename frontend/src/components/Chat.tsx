import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from '../types';
import { chatService } from '../services/api';
import ChatContainer from './ChatContainer';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check API health on component mount
    const checkHealth = async () => {
      try {
        await chatService.health();
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
        console.error('API health check failed:', error);
      }
    };
    
    checkHealth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: t('errors.genericError'),
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer>
      <ChatHeader isConnected={isConnected} />
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput
        value={inputValue}
        isLoading={isLoading}
        isConnected={isConnected}
        onChange={setInputValue}
        onSubmit={handleSubmit}
      />
    </ChatContainer>
  );
};

export default Chat;
