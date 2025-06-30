import { describe, test, expect } from '@jest/globals';
import { openAiRequest } from '../../src/utils/openAiRequest';

jest.mock('../../src/config', () => ({
  envs: { openai: { model: 'modelo' } },
  openaiClient: {
    chat: {
      completions: {
        create: jest.fn(async () => ({ choices: [] })),
      },
    },
  },
}));

describe('openAiRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('devuelve string vacío si no hay respuesta', async () => {
    const result = await openAiRequest('mensaje');
    expect(result).toBe('');
  });

  test('devuelve la respuesta de OpenAI correctamente', async () => {
    const realMock = jest.requireMock('../../src/config').openaiClient.chat.completions.create;
    realMock.mockResolvedValueOnce({ choices: [{ message: { content: 'respuesta AI' } }] });
    const result = await openAiRequest('mensaje');
    expect(result).toBe('respuesta AI');
  });
});
