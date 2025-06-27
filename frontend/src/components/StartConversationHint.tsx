import React from 'react';
import { Sparkles } from 'lucide-react';

const StartConversationHint = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-gray-600 py-10">
      <Sparkles className="w-8 h-8 text-blue-400 mb-2 animate-bounce" />
      <p className="text-lg font-medium">¡Inicia una nueva conversación!</p>
      <p className="text-sm mt-1 max-w-xs">
        Escribe tu mensaje abajo y el asistente responderá en segundos.
      </p>
    </div>
  );
};

export default StartConversationHint;
