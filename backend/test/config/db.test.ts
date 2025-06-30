import { describe, test, expect } from '@jest/globals';
import * as db from '../../src/config/db';

describe('DB Config', () => {
  test('El módulo de db existe', () => {
    expect(db).toBeDefined();
  });
});
