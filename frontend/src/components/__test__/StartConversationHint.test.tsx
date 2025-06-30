import { render, screen } from '@testing-library/react';
import StartConversationHint from '../StartConversationHint';

describe('StartConversationHint', () => {
  it('renderiza el mensaje de inicio de conversación', () => {
    render(<StartConversationHint />);
    expect(screen.getByText('¡Inicia una nueva conversación!')).toBeInTheDocument();
    expect(
      screen.getByText('Escribe tu mensaje abajo y el asistente responderá en segundos.')
    ).toBeInTheDocument();
  });
});
