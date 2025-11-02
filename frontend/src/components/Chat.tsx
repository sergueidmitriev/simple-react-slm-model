import { useHealthCheck } from '../hooks/useHealthCheck';
import { useChatMessages } from '../hooks/useChatMessages';
import ChatContainer from './ChatContainer';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const Chat = () => {
  const isConnected = useHealthCheck();
  const {
    messages,
    inputValue,
    isLoading,
    isCancelled,
    isStreaming,
    setInputValue,
    setIsStreaming,
    handleSubmit,
    handleCancel,
  } = useChatMessages(isConnected);

  return (
    <ChatContainer>
      <ChatHeader isConnected={isConnected} />
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput
        value={inputValue}
        isLoading={isLoading}
        isCancelled={isCancelled}
        isConnected={isConnected}
        isStreaming={isStreaming}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onStreamingToggle={() => setIsStreaming(!isStreaming)}
      />
    </ChatContainer>
  );
};

export default Chat;
