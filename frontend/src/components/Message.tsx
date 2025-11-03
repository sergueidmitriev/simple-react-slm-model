import { memo } from 'react';
import { Message } from '../types';

interface MessageProps {
  message: Message;
}

const MessageComponent = memo(({ message }: MessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      role="article"
      aria-label={`${isUser ? 'You' : 'Assistant'} message`}
    >
      <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <p className="message-timestamp" aria-label={`Sent at ${message.timestamp.toLocaleTimeString()}`}>
          <time dateTime={message.timestamp.toISOString()}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </time>
        </p>
      </div>
    </div>
  );
});

MessageComponent.displayName = 'MessageComponent';

export default MessageComponent;
