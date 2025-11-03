import { ReactNode } from 'react';

interface ChatContainerProps {
  children: ReactNode;
}

const ChatContainer = ({ children }: ChatContainerProps) => {
  return (
    <div className="chat-container">
      <div className="chat-box">
        {children}
      </div>
    </div>
  );
};

export default ChatContainer;
