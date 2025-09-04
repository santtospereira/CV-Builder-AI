import React from 'react';

interface ExportButtonProps {
  onExport: () => Promise<void>;
  isLoading: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport, isLoading }) => {
  return (
    <button
      onClick={onExport}
      disabled={isLoading}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out disabled:bg-gray-400"
    >
      {isLoading ? 'Gerando...' : 'Exportar para PDF'}
    </button>
  );
};

export default ExportButton;
