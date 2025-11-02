import React from 'react';

interface ChatContainerProps {
  children: React.ReactNode;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ children }) => {
  return (
    <div className="chat-container">
      <div className="chat-box">
        {children}
      </div>
    </div>
  );
};

export default ChatContainer;
