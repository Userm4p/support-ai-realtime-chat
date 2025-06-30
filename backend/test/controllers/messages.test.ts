import { getMessages, createMessage } from '../../src/controllers';
import { messagesRepository } from '../../src/repositories';
import { handleMessage } from '../../src/utils';
import { Response } from 'express';

jest.mock('../../src/repositories', () => ({
  messagesRepository: {
    countAllMessages: jest.fn(),
    getCachedMessages: jest.fn(),
    getAllMessages: jest.fn(),
    createMessage: jest.fn(),
    addMessageToQueue: jest.fn(),
  },
}));

jest.mock('../../src/utils', () => ({
  handleMessage: jest.fn(),
}));

const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('messageController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMessages', () => {
    it('retorna mensajes en caché cuando rest es false', async () => {
      const req = {
        query: {
          rest: 'false',
        },
      } as unknown as any;

      const res = mockResponse();

      (messagesRepository.countAllMessages as jest.Mock).mockResolvedValue(10);
      (messagesRepository.getCachedMessages as jest.Mock).mockResolvedValue([
        { id: '1', content: 'Hola', sender: 'user' },
      ]);

      await getMessages(req, res);

      expect(messagesRepository.countAllMessages).toHaveBeenCalled();
      expect(messagesRepository.getCachedMessages).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        messages: [{ id: '1', content: 'Hola', sender: 'user' }],
        total: 10,
      });
    });

    it('retorna todos los mensajes cuando rest es true', async () => {
      const req = {
        query: {
          rest: 'true',
        },
      } as unknown as any;

      const res = mockResponse();

      (messagesRepository.countAllMessages as jest.Mock).mockResolvedValue(20);
      (messagesRepository.getAllMessages as jest.Mock).mockResolvedValue([
        { id: '1', content: 'Hola', sender: 'user' },
        { id: '2', content: 'Hola bot', sender: 'bot' },
      ]);

      await getMessages(req, res);

      expect(messagesRepository.getAllMessages).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        messages: [
          { id: '1', content: 'Hola', sender: 'user' },
          { id: '2', content: 'Hola bot', sender: 'bot' },
        ],
        count: 20,
      });
    });

    it('retorna error 500 si falla algo', async () => {
      const req = {
        query: {
          rest: 'false',
        },
      } as unknown as any;

      const res = mockResponse();

      (messagesRepository.countAllMessages as jest.Mock).mockRejectedValue(new Error('DB error'));

      await getMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error fetching messages',
      });
    });
  });

  describe('createMessage', () => {
    it('crea mensaje de usuario y respuesta del bot correctamente', async () => {
      const req = {
        body: {
          content: 'Hola',
        },
      } as any;

      const res = mockResponse();

      const userMessage = { id: '1', content: 'Hola', sender: 'user' };
      const botReply = { reply: 'Hola humano' };
      const botMessage = { id: '2', content: 'Hola humano', sender: 'bot' };

      (messagesRepository.createMessage as jest.Mock)
        .mockResolvedValueOnce(userMessage)
        .mockResolvedValueOnce(botMessage);

      (handleMessage as jest.Mock).mockResolvedValue(botReply);

      await createMessage(req, res);

      expect(messagesRepository.createMessage).toHaveBeenCalledTimes(2);
      expect(handleMessage).toHaveBeenCalledWith('Hola');
      expect(messagesRepository.addMessageToQueue).toHaveBeenCalledWith(botMessage);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(userMessage);
    });

    it('retorna error 500 si algo falla', async () => {
      const req = {
        body: {
          content: 'Hola',
        },
      } as any;

      const res = mockResponse();

      (messagesRepository.createMessage as jest.Mock).mockRejectedValue(new Error('DB error'));

      await createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal server error',
        error: 'DB error',
      });
    });
  });
});
