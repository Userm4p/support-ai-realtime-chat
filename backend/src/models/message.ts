import { z } from 'zod';

type Sender = 'user' | 'bot';

interface Message {
  id: string;
  sender: Sender;
  content: string;
  timestamp: Date;
}

const messageSchema = z.object({
  sender: z.enum(['user', 'bot']),
  content: z.string().min(1),
});

export { Message, messageSchema };
