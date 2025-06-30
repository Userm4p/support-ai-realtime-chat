import { describe, it, expect } from '@jest/globals';
import * as middlewares from '../../src/middlewares/messages';
import { messagesValidation } from '../../src/middlewares/messages';

describe('Messages Middleware', () => {
  it('El módulo de middleware existe', () => {
    expect(middlewares).toBeDefined();
  });

  it('messagesValidation existe', () => {
    expect(typeof middlewares.messagesValidation).toBe('function');
  });
});

describe('messagesValidation', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('llama a next si la validación es exitosa', () => {
    req.body = { sender: 'user', content: 'hola' };
    messagesValidation(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('devuelve error 400 si la validación falla', () => {
    req.body = { sender: 'user', content: '' };
    messagesValidation(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: expect.any(Object) });
    expect(next).not.toHaveBeenCalled();
  });
});
