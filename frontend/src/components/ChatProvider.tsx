'use client';
import React from 'react';
import { useChat } from 'chatbot/hooks/useChat';
import { ChatContext } from 'chatbot/context/chatContext';

interface Props {
  children: React.ReactNode;
}

const ChatProvider = ({ children }: Props) => {
  const contextValue = useChat();
  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
