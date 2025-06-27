import { Router } from 'express';
import { createMessage, getMessages } from '../controllers';
import { messagesValidation } from '../middlewares';

const messages = Router();

messages.get('/', getMessages);

messages.post('/', messagesValidation, createMessage);

export default messages;
