import { Request, Response } from 'express';
import { Message } from '../models';
import { handleMessage } from '../utils/handleResponse';
import { prisma, redisClient } from '../config';

const getMessages = async (req: Request, res: Response) => {
  const includeRest = req.query.include === 'rest';

  try {
    const rawRedis = await redisClient.lRange('chat:messages', 0, -1);
    const redisMessages = rawRedis.map((msg) => JSON.parse(msg));

    if (!includeRest) {
      res.json({ messages: redisMessages });
      return;
    }

    const redisIds = redisMessages.map((msg) => msg.id);

    const dbMessages = await prisma.message.findMany({
      where: {
        NOT: {
          id: { in: redisIds },
        },
      },
      orderBy: { timestamp: 'asc' },
    });

    const allMessages = [...redisMessages, ...dbMessages];
    res.json({ messages: allMessages });
    return;
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Error fetching messages' });
    return;
  }
};

const createMessage = async (req: Request<{}, {}, Message, {}>, res: Response) => {
  try {
    const { content } = req.body;

    const botReply = handleMessage(content);

    const createdMessages = await prisma.$transaction([
      prisma.message.create({
        data: {
          sender: 'user',
          content,
        },
      }),
      prisma.message.create({
        data: {
          sender: 'bot',
          content: botReply.reply,
        },
      }),
    ]);

    await redisClient.rPush(
      'chat:messages',
      JSON.stringify({
        sender: 'user',
        content,
        timestamp: new Date().toISOString(),
        id: createdMessages[0].id,
      }),
    );
    await redisClient.rPush(
      'chat:messages',
      JSON.stringify({
        sender: 'bot',
        content: botReply.reply,
        timestamp: new Date().toISOString(),
        id: createdMessages[1].id,
      }),
    );

    res.status(201).json({
      message: 'Message created',
      data: {
        botMessage: createdMessages[1],
        generateWithAi: botReply.generateWithAi,
      },
    });
    return;
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return;
  }
};

export { getMessages, createMessage };
