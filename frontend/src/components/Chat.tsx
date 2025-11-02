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
    setInputValue,
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
        onChange={setInputValue}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </ChatContainer>
  );
};

export default Chat;
