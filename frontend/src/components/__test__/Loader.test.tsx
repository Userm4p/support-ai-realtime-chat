import { render, screen } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader', () => {
  it('renderiza el loader correctamente', () => {
    render(<Loader />);
    expect(screen.getByText('Cargando mensajes...')).toBeInTheDocument();
  });
});
