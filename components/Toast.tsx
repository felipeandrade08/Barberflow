
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Bell, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    success: <CheckCircle className="text-emerald-400" size={20} />,
    error: <XCircle className="text-red-400" size={20} />,
    info: <Bell className="text-blue-400" size={20} />,
    warning: <Info className="text-amber-400" size={20} />,
  };

  const bgColors = {
    success: 'bg-emerald-500/10 border-emerald-500/20',
    error: 'bg-red-500/10 border-red-500/20',
    info: 'bg-blue-500/10 border-blue-500/20',
    warning: 'bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className={`flex items-center space-x-3 p-4 rounded-2xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-right-10 duration-300 ${bgColors[type]}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-sm font-medium text-white flex-1">{message}</p>
      <button onClick={() => onClose(id)} className="text-slate-500 hover:text-white transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
