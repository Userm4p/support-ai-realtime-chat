'use client';
import Loader from 'chatbot/components/Loader';
import Message from 'chatbot/components/Message';
import StartConversationHint from 'chatbot/components/StartConversationHint';
import { ChatContext } from 'chatbot/context/chatContext';
import { useContext, useEffect, useRef } from 'react';

const Chat = () => {
  const containerRef = useRef<HTMLDivElement>(null);
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
  } = useContext(ChatContext);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-gray-950 shadow p-4 text-xl font-semibold">Chat Soporte</header>
      <main
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('/pattern.svg')] bg-repeat bg-gray-100"
      >
        {!loadingAllMessages && totalMessages > messages.length && (
          <button className="text-xs text-blue-600 underline mb-2" onClick={fetchAllMessages}>
            Cargar mensajes anteriores
          </button>
        )}
        {!loadingMessages &&
          !loadingAllMessages &&
          messages.length === 0 &&
          currentConversationMessagesToShow.length === 0 && <StartConversationHint />}
        {loadingAllMessages && <Loader />}
        {messagesToShow.map(msg => (
          <Message key={msg.id} msg={msg} />
        ))}
        {messages.length > 0 && (
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
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          Enviar
        </button>
      </footer>
    </div>
  );
};

export default Chat;
