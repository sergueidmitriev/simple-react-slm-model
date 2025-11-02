import React from 'react';
import { Message } from '../types';

interface MessageProps {
  message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${
        isUser 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-sm' 
          : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-sm'
      } px-4 py-3 shadow-sm`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <p className={`text-xs mt-2 ${
          isUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
};

export default MessageComponent;