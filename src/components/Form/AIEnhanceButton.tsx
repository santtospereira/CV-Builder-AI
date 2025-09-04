import React from 'react';
import LoadingSpinner from '../UI/LoadingSpinner';

interface AIEnhanceButtonProps {
  onClick: () => void;
  loading: boolean;
  label: string;
}

const AIEnhanceButton: React.FC<AIEnhanceButtonProps> = ({ onClick, loading, label }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? <LoadingSpinner /> : label}
    </button>
  );
};

export default AIEnhanceButton;
