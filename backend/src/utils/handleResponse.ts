export function handleMessage(userMessage: string) {
  let botReply = {
    reply: '',
    generateWithAi: false,
  };

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
      botReply.generateWithAi = true;
  }

  return botReply;
}
