import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const baseClasses = "fixed bottom-4 right-4 rounded-lg px-6 py-3 text-white shadow-lg transition-all duration-300 transform";
  const colorClasses = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      {message}
    </div>
  );
};

export default Toast;
