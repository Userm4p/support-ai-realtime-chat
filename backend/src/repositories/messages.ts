import { prisma, redisClient, mqttClient } from '../config';
import { Message } from '../models';

const REDIS_KEY = 'chat:messages';
const MQTT_TOPIC = 'chat/messages';

const messagesRepository = {
  getCachedMessages: async function () {
    try {
      const rawRedis = await redisClient.lRange(REDIS_KEY, 0, -1);
      if (!rawRedis) {
        return [];
      }
      const redisMessages: Message[] = rawRedis.map((msg) => JSON.parse(msg));
      return redisMessages;
    } catch (error) {
      console.error('Error al obtener mensajes de Redis:', error);
      throw new Error('Error fetching messages from Redis');
    }
  },

  getDbMessages: async function (exceptions: string[] = []) {
    try {
      const dbMessages = await prisma.message.findMany({
        where: {
          NOT: {
            id: { in: exceptions },
          },
        },
        orderBy: { timestamp: 'asc' },
      });
      return dbMessages;
    } catch (error) {
      console.error('Error al obtener mensajes de la base de datos:', error);
      throw new Error('Error fetching messages from database');
    }
  },

  getAllMessages: async function () {
    try {
      const redisMessages: Message[] = await this.getCachedMessages();
      const redisIds = redisMessages.map((msg) => msg.id);
      const dbMessages: Message[] = await this.getDbMessages(redisIds);
      const allMessages = [...redisMessages, ...dbMessages];
      allMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      return allMessages;
    } catch (error) {
      console.error('Error al obtener todos los mensajes:', error);
      throw new Error('Error fetching all messages');
    }
  },

  countAllMessages: async function () {
    try {
      const redisMessages = await this.getCachedMessages();
      const dbMessages = await this.getDbMessages();
      return redisMessages.length + dbMessages.length;
    } catch (error) {
      console.error('Error al contar mensajes:', error);
      throw new Error('Error counting messages');
    }
  },

  createMessageInCache: async function (message: Message) {
    try {
      await redisClient.rPush(REDIS_KEY, JSON.stringify(message));
    } catch (error) {
      console.error('Error al guardar mensaje en Redis:', error);
      throw new Error('Error saving message to Redis');
    }
  },

  createMessageInDb: async function (message: Message) {
    try {
      const createdMessage = await prisma.message.create({
        data: message,
      });
      return createdMessage;
    } catch (error) {
      console.error('Error al guardar mensaje en la base de datos:', error);
      throw new Error('Error saving message to database');
    }
  },

  addMessageToQueue: async function (message: Message) {
    try {
      if (mqttClient.connected) {
        mqttClient.publish(MQTT_TOPIC, JSON.stringify(message), { qos: 1 }, (error) => {
          if (error) {
            console.error('Error al publicar mensaje en MQTT:', error);
          } else {
            console.log('✅ Mensaje publicado en MQTT:', message);
          }
        });
      } else {
        console.warn('⚠️ MQTT no está conectado. Mensaje no enviado.');
      }
    } catch (error) {
      console.error('Error al publicar mensaje en MQTT:', error);
      throw new Error('Error publishing message to MQTT');
    }
  },

  createMessage: async function (message: Omit<Message, 'id' | 'timestamp'>) {
    try {
      const createdMessage: Message = await this.createMessageInDb(message);
      await this.createMessageInCache(createdMessage);
      return createdMessage;
    } catch (error) {
      console.error('Error al crear mensaje:', error);
      throw new Error('Error creating message');
    }
  },
};

export { messagesRepository };
