import { Request, Response } from 'express';
import { Message } from '../models';
import { handleMessage } from '../utils/handleResponse';
import { prisma, redisClient } from '../config';

const getMessages = async (req: Request, res: Response) => {
  res.status(200).json([
    {
      message: 'Messages fetched',
    },
  ]);
  return;
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
      }),
    );
    await redisClient.rPush(
      'chat:messages',
      JSON.stringify({
        sender: 'bot',
        content,
        timestamp: new Date().toISOString(),
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
