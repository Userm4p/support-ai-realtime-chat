import { describe, test, expect } from '@jest/globals';
import * as openai from '../../src/config/openai';

describe('OpenAI Config', () => {
  test('El módulo de openai existe', () => {
    expect(openai).toBeDefined();
  });
});
