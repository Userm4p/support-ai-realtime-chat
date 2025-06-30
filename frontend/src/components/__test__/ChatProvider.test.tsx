import { render } from '@testing-library/react';
import ChatProvider from '../ChatProvider';
import React from 'react';

jest.mock('../../hooks/useChat', () => ({
  useChat: () => ({
    messages: [],
    currentConversationMessages: [],
    input: '',
    handleInputChange: jest.fn(),
    handleSend: jest.fn(),
    fetchMessages: jest.fn(),
    fetchAllMessages: jest.fn(),
    loading: { messages: false, allMessages: false, sendMessage: false },
    messagesToShow: [],
    currentConversationMessagesToShow: [],
    totalMessages: 0,
    errors: [],
    handleCloseErrorsModal: jest.fn(),
    containerRef: null,
  }),
}));

describe('ChatProvider', () => {
  it('renderiza los children correctamente', () => {
    const { getByText } = render(
      <ChatProvider>
        <div>contenido</div>
      </ChatProvider>
    );
    expect(getByText('contenido')).toBeInTheDocument();
  });
});
