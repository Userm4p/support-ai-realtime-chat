'use client';
import axios from 'axios';
import { envs } from 'chatbot/config/envs';
import { ChatContextType, Loading, Message } from 'chatbot/context/chatContext';
import mqtt from 'mqtt';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const TOPIC = 'chat/messages';

interface MessagesResp {
  messages: Message[];
  total: number;
}

export const useChat = (): ChatContextType => {
  const clientRef = useRef<mqtt.MqttClient | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationMessages, setCurrentConversationMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<Loading>({
    allMessages: false,
    messages: false,
    sendMessage: false,
  });
  const [input, setInput] = useState<string>('');
  const [totalMessages, setTotalMessages] = useState<number>(0);
  const [errors, setErrors] = useState<string[]>([]);

  const instance = axios.create({
    baseURL: envs.backend,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleScrollToBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      container.scrollTop = container.scrollHeight;
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  const fetchMessages = useCallback(async (rest: boolean = false) => {
    setLoading(prev => ({ ...prev, messages: true }));
    try {
      const { data } = await instance.get<MessagesResp>(`/api/messages${rest ? '?rest=true' : ''}`);
      setMessages(data.messages);
      setTotalMessages(data.total);
      
    } catch (error) {
      console.error('Error fetching messages:', error);
      setErrors(prev => [...prev, 'Error obteniendo mensajes']);
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  }, []);

  const fetchAllMessages = useCallback(async () => {
    setLoading(prev => ({ ...prev, allMessages: true }));
    try {
      await fetchMessages(true);
    } catch {
    } finally {
      setLoading(prev => ({ ...prev, allMessages: false }));
    }
  }, [handleScrollToBottom, fetchMessages]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setCurrentConversationMessages(prev => [...prev, newMessage]);
    setLoading(prev => ({ ...prev, sendMessage: true }));
    handleScrollToBottom();
    try {
      setInput('');
      await instance.post<Message>('/api/messages', newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      setErrors(prev => [...prev, 'Error enviando mensaje']);
    } finally {
      setLoading(prev => ({ ...prev, sendMessage: false }));
    }
  }, [input, handleScrollToBottom]);

  const formatMessagesToShow = useCallback((messages: Message[]) => {
    return messages.map(msg => {
      const date = new Date(msg.timestamp);
      const formattedDate = new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);

      return {
        ...msg,
        timestamp: formattedDate,
      };
    });
  }, []);

  const handleCloseErrorsModal = useCallback(() => {
    setErrors([]);
  }, []);

  useEffect(() => {
    const client = mqtt.connect(envs.mqtt!);

    client.on('connect', () => {
      console.log('Conectado a MQTT');
      client.subscribe(TOPIC, err => {
        if (err) {
          console.error('Error al suscribirse al topic:', err);
        }
      });
    });

    client.on('message', (_topic, message) => {
      setLoading(prev => ({ ...prev, sendMessage: false }));
      const parsedMessage: Message = JSON.parse(message.toString());
      setCurrentConversationMessages(prev => [...prev, parsedMessage]);
      handleScrollToBottom();
    });

    clientRef.current = client;

    return () => {
      client.end();
    };
  }, [handleScrollToBottom]);

  const messagesToShow = useMemo(() => {
    return formatMessagesToShow(messages);
  }, [messages, formatMessagesToShow]);

  const currentConversationMessagesToShow = useMemo(() => {
    return formatMessagesToShow(currentConversationMessages);
  }, [currentConversationMessages, formatMessagesToShow]);

  return {
    messages,
    currentConversationMessages,
    loading,
    input,
    handleInputChange,
    fetchAllMessages,
    fetchMessages,
    handleSend,
    messagesToShow,
    currentConversationMessagesToShow,
    totalMessages,
    errors,
    handleCloseErrorsModal,
    containerRef,
  };
};
