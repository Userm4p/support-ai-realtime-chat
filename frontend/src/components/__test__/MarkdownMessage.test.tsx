import { render, screen } from '@testing-library/react';
import MarkdownMessage from '../MarkdownMessage';

jest.mock('react-markdown', () => (props: any) => <div data-testid="md">{props.children}</div>);

describe('MarkdownMessage', () => {
  it('renderiza el texto markdown', () => {
    render(<MarkdownMessage text={'**Hola**'} />);
    expect(screen.getByTestId('md')).toHaveTextContent('**Hola**');
  });
});
