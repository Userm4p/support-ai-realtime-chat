import express from 'express';
import request from 'supertest';

import messagesRouter from '../../src/routes/messages';

jest.mock('../../src/controllers', () => ({
  createMessage: jest.fn((req, res) => res.status(201).json({ msg: 'mocked createMessage' })),
  getMessages: jest.fn((req, res) => res.status(200).json({ msg: 'mocked getMessages' })),
}));

jest.mock('../../src/middlewares', () => ({
  messagesValidation: jest.fn((req, res, next) => next()),
}));

import { createMessage, getMessages } from '../../src/controllers';
import { messagesValidation } from '../../src/middlewares';

describe('Messages Router', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/messages', messagesRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /messages debe usar getMessages', async () => {
    const res = await request(app).get('/messages');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'mocked getMessages' });
    expect(getMessages).toHaveBeenCalled();
  });

  it('POST /messages debe usar messagesValidation y createMessage', async () => {
    const res = await request(app).post('/messages').send({ content: 'Hola' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ msg: 'mocked createMessage' });
    expect(messagesValidation).toHaveBeenCalled();
    expect(createMessage).toHaveBeenCalled();
  });
});
