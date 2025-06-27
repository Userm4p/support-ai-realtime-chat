import { useContext } from 'react';
import { X } from 'lucide-react';
import { ChatContext } from 'chatbot/context/chatContext';

const ErrorToast = () => {
  const { errors, handleCloseErrorsModal } = useContext(ChatContext);

  if (errors.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2">
      <div className="bg-red-600 text-white rounded-lg shadow-lg p-4 relative">
        <button
          onClick={handleCloseErrorsModal}
          className="absolute top-2 right-2 text-white hover:text-gray-200 cursor-pointer"
        >
          <X size={18} />
        </button>

        <h2 className="font-bold mb-2">Se encontraron errores:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {errors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ErrorToast;
