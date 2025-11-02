import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { chatService } from '../services/api';
import MessageComponent from './Message';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [theme, setTheme] = useState<'modern' | 'terminal'>('modern');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'terminal' 
        ? 'bg-black' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className={`w-full max-w-2xl overflow-hidden min-h-[600px] flex flex-col ${
        theme === 'terminal'
          ? 'bg-black border-2 border-green-500 rounded-none shadow-[0_0_20px_rgba(34,197,94,0.3)]'
          : 'bg-white rounded-2xl shadow-2xl'
      }`}>
        {/* Header */}
        <div className={`p-6 ${
          theme === 'terminal'
            ? 'bg-black border-b-2 border-green-500'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${
                theme === 'terminal' ? 'text-green-500 font-mono' : 'text-white'
              }`}>
                {theme === 'terminal' ? '> SLM_TERMINAL' : 'SLM Chat Assistant'}
              </h1>
              <p className={`text-sm mt-1 ${
                theme === 'terminal' ? 'text-green-400 font-mono' : 'text-blue-100'
              }`}>
                {theme === 'terminal' ? 'SYSTEM v1.0.0 READY' : 'Powered by Small Language Model'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Theme Toggle - iPhone Style */}
              <div className="flex items-center space-x-2">
                <span className={`text-xs ${
                  theme === 'terminal' ? 'text-green-500 font-mono' : 'text-white'
                }`}>
                  Switch style
                </span>
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'modern' ? 'terminal' : 'modern')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    theme === 'terminal'
                      ? 'bg-green-600 focus:ring-green-500'
                      : 'bg-blue-400 focus:ring-blue-500'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      theme === 'terminal' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {/* Status */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full shadow-lg ${
                    isConnected 
                      ? theme === 'terminal' ? 'bg-green-500' : 'bg-green-400'
                      : 'bg-red-400'
                  }`}
                />
                <span className={`text-sm font-medium ${
                  theme === 'terminal' ? 'text-green-500 font-mono' : 'text-white'
                }`}>
                  {isConnected ? (theme === 'terminal' ? '[ONLINE]' : 'Online') : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className={`flex-1 overflow-y-auto p-6 space-y-4 min-h-0 ${
          theme === 'terminal' ? 'bg-black' : 'bg-gray-50'
        }`}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className={`rounded-full p-3 mb-3 ${
                theme === 'terminal' ? 'bg-green-950 border border-green-500' : 'bg-blue-50'
              }`}>
                <svg className={`w-6 h-6 ${
                  theme === 'terminal' ? 'text-green-500' : 'text-blue-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
              </div>
              <h3 className={`text-lg font-medium mb-1 ${
                theme === 'terminal' ? 'text-green-500 font-mono' : 'text-gray-700'
              }`}>
                {theme === 'terminal' ? '> AWAITING INPUT_' : 'Start a conversation'}
              </h3>
              <p className={`text-sm ${
                theme === 'terminal' ? 'text-green-400 font-mono' : 'text-gray-500'
              }`}>
                {theme === 'terminal' ? 'Type command below...' : 'Send a message to begin chatting'}
              </p>
            </div>
          ) : (
            messages.map(message => (
              <MessageComponent key={message.id} message={message} theme={theme} />
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className={`rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm max-w-xs ${
                theme === 'terminal'
                  ? 'bg-green-950 border border-green-500'
                  : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      theme === 'terminal' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      theme === 'terminal' ? 'bg-green-500' : 'bg-blue-500'
                    }`} style={{ animationDelay: '0.1s' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      theme === 'terminal' ? 'bg-green-500' : 'bg-blue-500'
                    }`} style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className={`text-xs ${
                    theme === 'terminal' ? 'text-green-500 font-mono' : 'text-gray-500'
                  }`}>
                    {theme === 'terminal' ? 'PROCESSING...' : 'AI is typing...'}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className={`p-6 border-t ${
          theme === 'terminal'
            ? 'bg-black border-green-500'
            : 'bg-white border-gray-200'
        }`}>
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={theme === 'terminal' ? '> Enter command...' : 'Type your message here...'}
                className={`w-full px-4 py-3 pr-12 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  theme === 'terminal'
                    ? 'bg-black border-2 border-green-500 text-green-500 font-mono placeholder-green-700 focus:border-green-400 focus:shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                    : 'border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                }`}
                disabled={isLoading || !isConnected}
              />
              {inputValue.trim() && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className={`text-xs ${
                    theme === 'terminal' ? 'text-green-600 font-mono' : 'text-gray-400'
                  }`}>
                    {inputValue.length}
                  </span>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || !isConnected || !inputValue.trim()}
              className={`px-6 py-3 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 ${
                theme === 'terminal'
                  ? 'bg-green-950 border-2 border-green-500 text-green-500 font-mono hover:bg-green-900 focus:shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 shadow-lg'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{theme === 'terminal' ? 'SEND' : 'Sending'}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>{theme === 'terminal' ? 'SEND' : 'Send'}</span>
                </>
              )}
            </button>
          </form>
          
          {!isConnected && (
            <div className={`mt-3 p-3 rounded-lg ${
              theme === 'terminal'
                ? 'bg-red-950 border border-red-500'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                <svg className={`w-4 h-4 ${
                  theme === 'terminal' ? 'text-red-500' : 'text-red-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`text-sm ${
                  theme === 'terminal' ? 'text-red-500 font-mono' : 'text-red-700'
                }`}>
                  {theme === 'terminal' ? 'ERROR: CONNECTION_LOST' : 'Connection lost. Please check your network and try again.'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;