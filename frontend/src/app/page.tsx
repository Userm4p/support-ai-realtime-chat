'use client';
import ErrorToast from 'chatbot/components/ErrorsModal';
import Loader from 'chatbot/components/Loader';
import Message from 'chatbot/components/Message';
import StartConversationHint from 'chatbot/components/StartConversationHint';
import { ChatContext } from 'chatbot/context/chatContext';
import { useContext, useEffect, useMemo } from 'react';

const Chat = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSend,
    fetchMessages,
    fetchAllMessages,
    loading: {
      messages: loadingMessages,
      allMessages: loadingAllMessages,
      sendMessage: loadingSendMessage,
    },
    messagesToShow,
    currentConversationMessagesToShow,
    totalMessages,
    containerRef,
  } = useContext(ChatContext);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const showLoadPreviousMessagesButton = useMemo(() => {
    return !loadingAllMessages && totalMessages > messages.length;
  }, [loadingAllMessages, totalMessages, messages.length]);

  const showStartConversationHint = useMemo(() => {
    return (
      !loadingMessages &&
      !loadingAllMessages &&
      messages.length === 0 &&
      currentConversationMessagesToShow.length === 0
    );
  }, [
    loadingMessages,
    messages.length,
    currentConversationMessagesToShow.length,
    loadingAllMessages,
  ]);

  const showOldMessagesAdvice = useMemo(() => {
    return messages.length > 0;
  }, [messages.length]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <ErrorToast />
      <header className="bg-gray-950 shadow p-4 text-xl font-semibold">Chat Soporte</header>
      <main
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('/pattern.svg')] bg-repeat bg-gray-100"
      >
        {showLoadPreviousMessagesButton && (
          <button
            className="text-xs text-blue-600 underline mb-2 cursor-pointer"
            onClick={fetchAllMessages}
          >
            Cargar mensajes anteriores
          </button>
        )}
        {showStartConversationHint && <StartConversationHint />}
        {loadingAllMessages && <Loader />}
        {messagesToShow.map(msg => (
          <Message key={msg.id} msg={msg} />
        ))}
        {showOldMessagesAdvice && (
          <div className="flex justify-center items-center py-4">
            <span className="ml-2 text-sm text-gray-600">Mensajes antiguos</span>
          </div>
        )}
        {currentConversationMessagesToShow.map(msg => (
          <Message key={msg.id} msg={msg} />
        ))}
        {loadingSendMessage && (
          <Message
            msg={{ id: 'loading', sender: 'bot', content: '', timestamp: '', loading: true }}
          />
        )}
      </main>
      <footer className="p-4 bg-gray-950 border-t flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={handleInputChange}
          placeholder="Escribe un mensaje..."
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-700 cursor-pointer"
        >
          Enviar
        </button>
      </footer>
    </div>
  );
};

export default Chat;
