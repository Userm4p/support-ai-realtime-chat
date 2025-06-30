import { render, screen, fireEvent } from '@testing-library/react';
import ErrorsModal from '../ErrorsModal';
import { ChatContext, ChatContextType } from 'chatbot/context/chatContext';
import React from 'react';

const mockHandleClose = jest.fn();

const renderWithContext = (ctx: Partial<ChatContextType>) => {
  const defaultValue: ChatContextType = {
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
    handleCloseErrorsModal: mockHandleClose,
    containerRef: null,
    ...ctx,
  };
  return render(
    <ChatContext.Provider value={defaultValue}>
      <ErrorsModal />
    </ChatContext.Provider>
  );
};

describe('ErrorsModal', () => {
  beforeEach(() => jest.clearAllMocks());

  it('no renderiza nada si no hay errores', () => {
    const { container } = renderWithContext({ errors: [] });
    expect(container.firstChild).toBeNull();
  });

  it('renderiza los errores y permite cerrarlos', () => {
    renderWithContext({ errors: ['Error 1', 'Error 2'] });
    expect(screen.getByText('Se encontraron errores:')).toBeInTheDocument();
    expect(screen.getByText('Error 1')).toBeInTheDocument();
    expect(screen.getByText('Error 2')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandleClose).toHaveBeenCalled();
  });
});
