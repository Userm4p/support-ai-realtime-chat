'use client';
import { createContext } from 'react';

type Sender = 'user' | 'bot';

export interface Message {
  id: string;
  sender: Sender;
  content: string;
  timestamp: string;
  loading?: boolean;
}

export interface Loading {
  messages: boolean;
  allMessages: boolean;
  sendMessage: boolean;
}

export interface ChatContextType {
  messages: Message[];
  currentConversationMessages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSend: () => Promise<void>;
  fetchMessages: () => Promise<void>;
  fetchAllMessages: () => Promise<void>;
  loading: Loading;
  messagesToShow: Message[];
  currentConversationMessagesToShow: Message[];
  totalMessages: number;
  errors: string[];
  handleCloseErrorsModal: () => void;
  containerRef: React.RefObject<HTMLDivElement | null> | null;
}

export const ChatContext = createContext<ChatContextType>({
  messages: [],
  currentConversationMessages: [],
  input: '',
  handleInputChange: () => {},
  handleSend: async () => {},
  fetchMessages: async () => {},
  fetchAllMessages: async () => {},
  loading: {
    messages: false,
    allMessages: false,
    sendMessage: false,
  },
  messagesToShow: [],
  currentConversationMessagesToShow: [],
  totalMessages: 0,
  errors: [],
  handleCloseErrorsModal: () => {},
  containerRef: null,
});
