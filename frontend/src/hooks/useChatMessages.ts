import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from '../types';
import { chatService } from '../services/api';
import { generateMessageId, MESSAGE_ID_OFFSET } from '../utils/messageId';

interface UseChatMessagesReturn {
  messages: Message[];
  inputValue: string;
  isLoading: boolean;
  setInputValue: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Custom hook to manage chat messages and interactions
 * @param isConnected - Whether the API is connected
 * @returns Chat message state and handlers
 */
export const useChatMessages = (isConnected: boolean): UseChatMessagesReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !isConnected) return;

    const userMessage: Message = {
      id: generateMessageId(MESSAGE_ID_OFFSET.USER),
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
        id: generateMessageId(MESSAGE_ID_OFFSET.ASSISTANT),
        content: response.message,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: generateMessageId(MESSAGE_ID_OFFSET.ERROR),
        content: t('errors.genericError'),
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    inputValue,
    isLoading,
    setInputValue,
    handleSubmit,
  };
};
