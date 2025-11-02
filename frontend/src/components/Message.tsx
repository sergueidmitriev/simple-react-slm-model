import React, { memo } from 'react';
import { Message } from '../types';

interface MessageProps {
  message: Message;
}

const MessageComponent: React.FC<MessageProps> = memo(({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <p className="message-timestamp">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
});

MessageComponent.displayName = 'MessageComponent';

export default MessageComponent;
