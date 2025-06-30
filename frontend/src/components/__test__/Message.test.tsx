import { render, screen } from '@testing-library/react';
import Message from '../Message';
import React from 'react';

const baseMsg = {
  id: '1',
  sender: 'user' as const,
  content: 'Hola',
  timestamp: '2024-01-01',
};

describe('Message', () => {
  it('renderiza mensaje de usuario', () => {
    render(<Message msg={{ ...baseMsg, sender: 'user' }} />);
    expect(screen.getByText('Hola')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
  });

  it('renderiza mensaje del bot', () => {
    render(<Message msg={{ ...baseMsg, sender: 'bot' as const }} />);
    expect(screen.getByText('Hola')).toBeInTheDocument();
  });

  it('renderiza loading', () => {
    render(<Message msg={{ ...baseMsg, loading: true }} />);
    expect(screen.getByText('Generando respuesta')).toBeInTheDocument();
  });
});
