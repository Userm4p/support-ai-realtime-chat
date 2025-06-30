import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'geist-sans' }),
  Geist_Mono: () => ({ variable: 'geist-mono' }),
}));

jest.mock('../../components/ChatProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chat-provider">{children}</div>
  ),
}));

import RootLayout from '../layout';

describe('RootLayout', () => {
  it('renderiza los children y aplica las clases de fuentes', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <RootLayout>
        <div>contenido de prueba</div>
      </RootLayout>
    );
    expect(screen.getByTestId('chat-provider')).toBeInTheDocument();
    const body = document.querySelector('body');
    expect(body).toHaveClass('geist-sans');
    expect(body).toHaveClass('geist-mono');
    (console.error as jest.Mock).mockRestore();
  });
});
