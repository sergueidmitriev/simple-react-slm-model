import React from 'react';
import { useHealthCheck } from '../hooks/useHealthCheck';
import { useChatMessages } from '../hooks/useChatMessages';
import ChatContainer from './ChatContainer';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const Chat: React.FC = () => {
  const isConnected = useHealthCheck();
  const {
    messages,
    inputValue,
    isLoading,
    setInputValue,
    handleSubmit,
  } = useChatMessages(isConnected);

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
