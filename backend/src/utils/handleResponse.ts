import { openAiRequest } from './openAiRequest';
export async function handleMessage(userMessage: string) {
  const botReply = {
    reply: '',
    generateWithAi: false,
  };

  try {
    switch (userMessage.toLowerCase()) {
      case 'hola':
        botReply.reply = 'Hola, ¿en qué puedo ayudarte?';
        break;
      case 'problema con ticket':
        botReply.reply = '¿Puedes darme más detalles sobre tu problema?';
        break;
      case 'gracias':
        botReply.reply = '¡De nada!';
        break;
      default:
        botReply.reply =
          (await openAiRequest(userMessage)) || 'Lo siento, no tengo una respuesta para eso.';
        botReply.generateWithAi = true;
    }
  } catch (error) {
    console.error('Error handling message:', error);
    botReply.reply = 'Lo siento, no entiendo tu pregunta';
    botReply.generateWithAi = true;
  }

  return botReply;
}
