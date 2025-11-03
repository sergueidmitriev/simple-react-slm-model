import { ReactNode, memo } from 'react';

interface ChatContainerProps {
  children: ReactNode;
}

const ChatContainer = memo(({ children }: ChatContainerProps) => {
  return (
    <div className="chat-container">
      <div className="chat-box">
        {children}
      </div>
    </div>
  );
});

ChatContainer.displayName = 'ChatContainer';

export default ChatContainer;
