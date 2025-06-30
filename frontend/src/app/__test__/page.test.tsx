import { render, screen } from '@testing-library/react';
import Page from '../page';

test('renderiza la página principal', () => {
  render(<Page />);
  expect(screen.getByText(/chat soporte/i)).toBeInTheDocument();
});
