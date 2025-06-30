import { messagesRepository } from '../../src/repositories';
import { redisClient, prisma, mqttClient } from '../../src/config';
import { Message } from '../../src/models';


jest.mock('../../src/config', () => ({
  redisClient: {
    lRange: jest.fn(),
    rPush: jest.fn(),
  },
  prisma: {
    message: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
  mqttClient: {
    connected: true,
    publish: jest.fn(),
  },
}));

describe('messagesRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const sampleMessage: Message = {
    id: '1',
    content: 'Hola',
    sender: 'user',
    timestamp: "2025-06-30",
  };

  describe('getCachedMessages', () => {
    it('retorna mensajes desde Redis', async () => {
      (redisClient.lRange as jest.Mock).mockResolvedValue([JSON.stringify(sampleMessage)]);

      const messages = await messagesRepository.getCachedMessages();
      expect(redisClient.lRange).toHaveBeenCalledWith('chat:messages', 0, -1);
      expect(messages).toEqual([sampleMessage]);
    });

    it('retorna arreglo vacío si no hay mensajes', async () => {
      (redisClient.lRange as jest.Mock).mockResolvedValue(null);

      const messages = await messagesRepository.getCachedMessages();
      expect(messages).toEqual([]);
    });

    it('lanza error si Redis falla', async () => {
      (redisClient.lRange as jest.Mock).mockRejectedValue(new Error('Redis down'));

      await expect(messagesRepository.getCachedMessages()).rejects.toThrow(
        'Error fetching messages from Redis',
      );
    });
  });

  describe('getDbMessages', () => {
    it('retorna mensajes desde la base de datos', async () => {
      (prisma.message.findMany as jest.Mock).mockResolvedValue([sampleMessage]);

      const result = await messagesRepository.getDbMessages(['2']);
      expect(prisma.message.findMany).toHaveBeenCalledWith({
        where: {
          NOT: {
            id: { in: ['2'] },
          },
        },
        orderBy: { timestamp: 'asc' },
      });
      expect(result).toEqual([sampleMessage]);
    });

    it('lanza error si falla la base de datos', async () => {
      (prisma.message.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(messagesRepository.getDbMessages()).rejects.toThrow(
        'Error fetching messages from database',
      );
    });
  });

  describe('getAllMessages', () => {
    it('combina y ordena mensajes de Redis y DB', async () => {
      const redisMsg = { ...sampleMessage, id: '1', timestamp: '2024-01-01T00:00:00.000Z' };
      const dbMsg = { ...sampleMessage, id: '2', timestamp: '2024-01-02T00:00:00.000Z' };

      jest.spyOn(messagesRepository, 'getCachedMessages').mockResolvedValue([redisMsg] as any);
      jest.spyOn(messagesRepository, 'getDbMessages').mockResolvedValue([dbMsg] as any);

      const result = await messagesRepository.getAllMessages();
      expect(result).toEqual([redisMsg, dbMsg]);
    });

    it('lanza error si falla algo internamente', async () => {
      jest.spyOn(messagesRepository, 'getCachedMessages').mockRejectedValue(new Error('Fail'));

      await expect(messagesRepository.getAllMessages()).rejects.toThrow(
        'Error fetching all messages',
      );
    });
  });

  describe('countAllMessages', () => {
    it('cuenta mensajes de la DB', async () => {
      jest
        .spyOn(messagesRepository, 'getDbMessages')
        .mockResolvedValue([sampleMessage, sampleMessage]);

      const count = await messagesRepository.countAllMessages();
      expect(count).toBe(2);
    });

    it('lanza error si falla', async () => {
      jest.spyOn(messagesRepository, 'getDbMessages').mockRejectedValue(new Error('error'));

      await expect(messagesRepository.countAllMessages()).rejects.toThrow(
        'Error counting messages',
      );
    });
  });

  describe('createMessageInCache', () => {
    it('guarda mensaje en Redis', async () => {
      await messagesRepository.createMessageInCache(sampleMessage);
      expect(redisClient.rPush).toHaveBeenCalledWith(
        'chat:messages',
        JSON.stringify(sampleMessage),
      );
    });

    it('lanza error si falla Redis', async () => {
      (redisClient.rPush as jest.Mock).mockRejectedValue(new Error('Redis error'));

      await expect(messagesRepository.createMessageInCache(sampleMessage)).rejects.toThrow(
        'Error saving message to Redis',
      );
    });
  });

  describe('createMessageInDb', () => {
    it('guarda mensaje en DB', async () => {
      (prisma.message.create as jest.Mock).mockResolvedValue(sampleMessage);

      const result = await messagesRepository.createMessageInDb(sampleMessage);
      expect(result).toEqual(sampleMessage);
    });

    it('lanza error si falla', async () => {
      (prisma.message.create as jest.Mock).mockRejectedValue(new Error('fail'));

      await expect(messagesRepository.createMessageInDb(sampleMessage)).rejects.toThrow(
        'Error saving message to database',
      );
    });
  });

  describe('addMessageToQueue', () => {
    it('publica en MQTT si está conectado', async () => {
      await messagesRepository.addMessageToQueue(sampleMessage);

      expect(mqttClient.publish).toHaveBeenCalledWith(
        'chat/messages',
        JSON.stringify(sampleMessage),
        { qos: 1 },
        expect.any(Function),
      );
    });

    it('no publica si no está conectado', async () => {
      (mqttClient.connected as boolean) = false;
      await messagesRepository.addMessageToQueue(sampleMessage);
      expect(mqttClient.publish).not.toHaveBeenCalled();
    });
  });

  describe('createMessage', () => {
    it('crea mensaje en DB y cache', async () => {
      const partialMsg = { content: 'Hey', sender: 'user' };
      const createdMsg = { ...partialMsg, id: '123', timestamp: new Date("2025-06-30").toISOString() };

      jest.spyOn(messagesRepository, 'createMessageInDb').mockResolvedValue(createdMsg as any);
      jest.spyOn(messagesRepository, 'createMessageInCache').mockResolvedValue();

      const result = await messagesRepository.createMessage(partialMsg as any);
      expect(result).toEqual(createdMsg);
    });

    it('lanza error si falla algo', async () => {
      jest.spyOn(messagesRepository, 'createMessageInDb').mockRejectedValue(new Error('fail'));

      await expect(
        messagesRepository.createMessage({ content: '...', sender: 'user' }),
      ).rejects.toThrow('Error creating message');
    });
  });
});
