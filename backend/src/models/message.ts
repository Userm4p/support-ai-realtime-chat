type Sender = 'user' | 'bot';

interface Message {
  id: string;
  sender: Sender;
  content: string;
  timestamp: Date;
}

export { Message };
