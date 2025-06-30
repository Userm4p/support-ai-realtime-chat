import { handleMessage } from '../../src/utils';

jest.mock('../../src/utils/openAiRequest', () => ({
  openAiRequest: jest.fn(),
}));

import { openAiRequest } from '../../src/utils/openAiRequest';

describe('handleMessage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('responde "Hola, ¿en qué puedo ayudarte?" para "hola"', async () => {
    const result = await handleMessage('hola');
    expect(result).toEqual({
      reply: 'Hola, ¿en qué puedo ayudarte?',
      generateWithAi: false,
    });
    expect(openAiRequest).not.toHaveBeenCalled();
  });

  it('responde con más detalles para "problema con ticket"', async () => {
    const result = await handleMessage('problema con ticket');
    expect(result).toEqual({
      reply: '¿Puedes darme más detalles sobre tu problema?',
      generateWithAi: false,
    });
    expect(openAiRequest).not.toHaveBeenCalled();
  });

  it('responde "¡De nada!" para "gracias"', async () => {
    const result = await handleMessage('gracias');
    expect(result).toEqual({
      reply: '¡De nada!',
      generateWithAi: false,
    });
    expect(openAiRequest).not.toHaveBeenCalled();
  });

  it('usa openAiRequest para mensaje desconocido', async () => {
    (openAiRequest as jest.Mock).mockResolvedValue('Respuesta de IA');

    const result = await handleMessage('algo no conocido');
    expect(openAiRequest).toHaveBeenCalledWith('algo no conocido');
    expect(result).toEqual({
      reply: 'Respuesta de IA',
      generateWithAi: true,
    });
  });

  it('usa respuesta por defecto si openAiRequest devuelve undefined', async () => {
    (openAiRequest as jest.Mock).mockResolvedValue(undefined);

    const result = await handleMessage('mensaje sin respuesta');
    expect(result).toEqual({
      reply: 'Lo siento, no tengo una respuesta para eso.',
      generateWithAi: true,
    });
  });

  it('maneja error de openAiRequest', async () => {
    (openAiRequest as jest.Mock).mockRejectedValue(new Error('API rota'));

    const result = await handleMessage('algo raro');
    expect(result).toEqual({
      reply: 'Lo siento, no entiendo tu pregunta',
      generateWithAi: true,
    });
  });
});
