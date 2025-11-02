import React, { useState, useEffect } from 'react';
import { Message, Theme } from '../types';
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
  const [theme, setTheme] = useState<Theme>(Theme.Modern);

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
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeToggle = () => {
    setTheme(theme === Theme.Modern ? Theme.Terminal : Theme.Modern);
  };

  return (
    <ChatContainer theme={theme}>
      <ChatHeader 
        theme={theme} 
        isConnected={isConnected} 
        onThemeToggle={handleThemeToggle}
      />
      <MessageList 
        messages={messages} 
        isLoading={isLoading} 
        theme={theme}
      />
      <MessageInput
        value={inputValue}
        isLoading={isLoading}
        isConnected={isConnected}
        theme={theme}
        onChange={setInputValue}
        onSubmit={handleSubmit}
      />
    </ChatContainer>
  );
};

export default Chat;