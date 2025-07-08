import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ProcessingStatusProps {
  status: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  status,
  message,
}) => {
  if (status === 'idle') {
    return null;
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
        };
      case 'error':
        return {
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
        };
      default:
        return {
          icon: <AlertCircle className="w-5 h-5 text-gray-600" />,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center space-x-3 p-4 rounded-lg border ${config.bgColor} ${config.borderColor} transition-all duration-300`}>
      {config.icon}
      <span className={`${config.textColor} font-medium`}>
        {message || `Status: ${status}`}
      </span>
    </div>
  );
};