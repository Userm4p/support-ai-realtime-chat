import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="ml-2 text-sm text-gray-600">Cargando mensajes...</span>
    </div>
  );
};

export default Loader;
