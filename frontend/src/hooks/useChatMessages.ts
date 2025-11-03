import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from '../types';
import { chatService } from '../services/api';
import { generateMessageId, MESSAGE_ID_OFFSET } from '../utils/messageId';
import { usePreferences } from '../contexts/PreferencesContext';

interface UseChatMessagesReturn {
  messages: Message[];
  inputValue: string;
  isLoading: boolean;
  isCancelled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  setInputValue: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
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
  const [isCancelled, setIsCancelled] = useState(false);
  const { preferences } = usePreferences();
  const { t, i18n } = useTranslation();
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingMessageIdRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current && isLoading) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setIsCancelled(true);
      
      // Hide cancel message after 3 seconds
      setTimeout(() => {
        setIsCancelled(false);
      }, 3000);
    }
  }, [isLoading]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !isConnected) return;

    // Clear any previous cancel message
    setIsCancelled(false);

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
      // Prepare model parameters from preferences
      const modelParams = {
        temperature: preferences.temperature,
        topP: preferences.topP,
        topK: preferences.topK,
      };

      if (preferences.streaming) {
        // Streaming mode
        const assistantMessageId = generateMessageId(MESSAGE_ID_OFFSET.ASSISTANT);
        streamingMessageIdRef.current = assistantMessageId;
        
        // Add empty assistant message that will be updated with chunks
        const assistantMessage: Message = {
          id: assistantMessageId,
          content: '',
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);

        let accumulatedContent = '';
        
        await chatService.streamMessage(
          userMessage.content,
          i18n.language,
          modelParams,
          (chunk: string) => {
            if (!abortControllerRef.current?.signal.aborted) {
              accumulatedContent += chunk;
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === assistantMessageId 
                    ? { ...msg, content: accumulatedContent }
                    : msg
                )
              );
            }
          },
          abortControllerRef.current.signal
        );
        
        streamingMessageIdRef.current = null;
      } else {
        // Non-streaming mode (original)
        const response = await chatService.sendMessage(
          userMessage.content,
          i18n.language,
          modelParams,
          abortControllerRef.current.signal
        );
        
        if (!abortControllerRef.current.signal.aborted) {
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
        streamingMessageIdRef.current = null;
        // Auto-focus input after response is complete
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }
  }, [inputValue, isLoading, isConnected, preferences.streaming, t, i18n.language]);

  return {
    messages,
    inputValue,
    isLoading,
    isCancelled,
    inputRef,
    setInputValue,
    handleSubmit,
    handleCancel,
  };
};
