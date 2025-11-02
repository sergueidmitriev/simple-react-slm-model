import { useState, useRef, useEffect, useCallback } from 'react';
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
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !isConnected) return;

    // Cancel any pending request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

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
      const response = await chatService.sendMessage(
        userMessage.content,
        abortControllerRef.current.signal
      );
      
      if (!abortControllerRef.current.signal.aborted) {
        // Use type guard to safely access message
        const messageContent = response.success 
          ? response.message 
          : response.error || t('errors.genericError');

        const assistantMessage: Message = {
          id: generateMessageId(MESSAGE_ID_OFFSET.ASSISTANT),
          content: messageContent,
          role: 'assistant',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      if (!abortControllerRef.current.signal.aborted) {
        const errorMessage: Message = {
          id: generateMessageId(MESSAGE_ID_OFFSET.ERROR),
          content: t('errors.genericError'),
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [inputValue, isLoading, isConnected, t]);

  return {
    messages,
    inputValue,
    isLoading,
    setInputValue,
    handleSubmit,
  };
};
