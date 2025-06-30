import { renderHook, act } from '@testing-library/react';
import { useChat } from '../useChat';
import axios from 'axios';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useChat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetchMessages actualiza mensajes y total correctamente', async () => {
    const fakeMessages = [{ id: '1', sender: 'user', content: 'Hola', timestamp: '2024-01-01' }];
    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockResolvedValueOnce({ data: { messages: fakeMessages, total: 1 } });
    const { result } = renderHook(() => useChat());
    await act(async () => {
      await result.current.fetchMessages();
    });
    expect(result.current.messages).toEqual(fakeMessages);
    expect(result.current.totalMessages).toBe(1);
    expect(result.current.errors).toEqual([]);
  });

  test('fetchMessages maneja errores correctamente', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useChat());
    await act(async () => {
      await result.current.fetchMessages();
    });
    expect(result.current.errors).toContain('Error obteniendo mensajes');
    consoleErrorSpy.mockRestore();
  });

  test('fetchAllMessages actualiza mensajes correctamente', async () => {
    const fakeMessages = [{ id: '2', sender: 'bot', content: 'Hola bot', timestamp: '2024-01-02' }];
    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockResolvedValueOnce({ data: { messages: fakeMessages, total: 1 } });
    const { result } = renderHook(() => useChat());
    await act(async () => {
      await result.current.fetchAllMessages();
    });
    expect(result.current.messages).toEqual(fakeMessages);
    expect(result.current.errors).toEqual([]);
  });

  test('fetchAllMessages maneja errores correctamente', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useChat());
    await act(async () => {
      await result.current.fetchAllMessages();
    });
    expect(result.current.errors).toContain('Error obteniendo mensajes');
    consoleErrorSpy.mockRestore();
  });

  test('handleSend agrega mensaje y limpia input (flujo exitoso)', async () => {
    mockedAxios.create.mockReturnThis();
    mockedAxios.post.mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useChat());
    act(() => {
      result.current.handleInputChange({ target: { value: 'Nuevo mensaje' } } as any);
    });
    await act(async () => {
      await result.current.handleSend();
    });
    expect(result.current.currentConversationMessages[0].content).toBe('Nuevo mensaje');
    expect(result.current.input).toBe('');
    expect(result.current.errors).toEqual([]);
  });

  test('handleSend maneja errores correctamente', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedAxios.create.mockReturnThis();
    mockedAxios.post.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useChat());
    act(() => {
      result.current.handleInputChange({ target: { value: 'Falla' } } as any);
    });
    await act(async () => {
      await result.current.handleSend();
    });
    expect(result.current.errors).toContain('Error enviando mensaje');
    consoleErrorSpy.mockRestore();
  });

  test('handleSend no envía si el input está vacío', async () => {
    mockedAxios.create.mockReturnThis();
    const { result } = renderHook(() => useChat());
    await act(async () => {
      await result.current.handleSend();
    });
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });
});
