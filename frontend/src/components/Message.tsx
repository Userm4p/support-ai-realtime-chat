import { Message as IMessage } from 'chatbot/context/chatContext';
import React from 'react';
import MarkdownMessage from './MarkdownMessage';

interface Props {
  msg: IMessage;
}

const Message = ({ msg }: Props) => {
  const isUser = msg.sender === 'user';
  const bubbleStyles = isUser ? 'bg-blue-500 text-right' : 'bg-gray-600 text-left';

  return (
    <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          p-3 rounded-lg text-white ${bubbleStyles}
          overflow-x-auto
          whitespace-pre-wrap
        `}
        style={{
          wordBreak: 'break-word',
        }}
      >
        {msg.loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-300">Generando respuesta...</span>
          </div>
        ) : (
          <div className="w-full">
            <MarkdownMessage text={msg.content} />
          </div>
        )}

        {!msg.loading && (
          <span className="text-[12px] text-gray-300 block mt-1">
            {msg.timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

export default Message;