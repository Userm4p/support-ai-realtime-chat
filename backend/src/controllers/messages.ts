import { Request, Response } from 'express';
import { Message } from '../models';
import { handleMessage } from '../utils';
import { messagesRepository } from '../repositories';

const getMessages = async (
  req: Request<
    '',
    '',
    '',
    {
      rest: string;
    }
  >,
  res: Response,
) => {
  const includeRest = req.query.rest === 'true';

  try {
    const messageCount = await messagesRepository.countAllMessages();

    if (!includeRest) {
      const redisMessages = await messagesRepository.getCachedMessages();
      res.json({ messages: redisMessages, total: messageCount });
      return;
    }
    const allMessages = await messagesRepository.getAllMessages();
    res.json({ messages: allMessages, count: messageCount });
    return;
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Error fetching messages' });
    return;
  }
};

const createMessage = async (req: Request<'', '', Message, ''>, res: Response) => {
  try {
    const { content } = req.body;

    const userMessage = await messagesRepository.createMessage({
      sender: 'user',
      content,
    });

    const botReply = await handleMessage(content);

    const botMessage = await messagesRepository.createMessage({
      sender: 'bot',
      content: botReply.reply,
    });

    await messagesRepository.addMessageToQueue(botMessage);

    res.status(201).json(userMessage);
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
