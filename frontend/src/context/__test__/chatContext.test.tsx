import { render, screen } from '@testing-library/react';
import ChatProvider from '../../components/ChatProvider';
import { ChatContext } from '../chatContext';

test('ChatProvider provee el contexto', () => {
  render(
    <ChatProvider>
      <ChatContext.Consumer>
        {value => <span>{typeof value === 'object' ? 'ok' : 'fail'}</span>}
      </ChatContext.Consumer>
    </ChatProvider>
  );
  expect(screen.getByText('ok')).toBeInTheDocument();
});
