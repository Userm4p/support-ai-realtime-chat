import { NextFunction, Request, Response } from 'express';
import { Message, messageSchema } from '../models';

const messagesValidation = (
  req: Request<'', '', Omit<Message, 'id' | 'timestamp'>, ''>,
  res: Response,
  next: NextFunction,
) => {
  const result = messageSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten() });
    return;
  }
  next();
};

export { messagesValidation };
