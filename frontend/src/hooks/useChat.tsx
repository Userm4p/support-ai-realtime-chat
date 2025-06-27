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

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationMessages, setCurrentConversationMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<Loading>({
    allMessages: false,
    messages: false,
    sendMessage: false,
  });
  const [input, setInput] = useState<string>('');
  const [totalMessages, setTotalMessages] = useState<number>(0);

  const instance = axios.create({
    baseURL: envs.backend,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const fetchMessages = useCallback(async () => {
    setLoading(prev => ({ ...prev, messages: true }));
    try {
      const { data } = await instance.get<MessagesResp>('/api/messages');
      setMessages(data.messages);
      setTotalMessages(data.total);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  }, []);

  const fetchAllMessages = useCallback(async () => {
    setLoading(prev => ({ ...prev, allMessages: true }));
    try {
      const { data } = await instance.get<MessagesResp>('/api/messages?rest=true');
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching all messages:', error);
    } finally {
      setLoading(prev => ({ ...prev, allMessages: false }));
    }
  }, []);

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
    try {
      setInput('');
      await instance.post<Message>('/api/messages', newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(prev => ({ ...prev, sendMessage: false }));
    }
  }, [input]);

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
    });

    clientRef.current = client;

    return () => {
      client.end();
    };
  }, []);

  const messagesToShow = useMemo(() => {
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
  }, [messages]);

  const currentConversationMessagesToShow = useMemo(() => {
    return currentConversationMessages.map(msg => {
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
  }, [currentConversationMessages]);

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
  };
};
