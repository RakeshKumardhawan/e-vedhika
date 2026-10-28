import React, { createContext, useContext } from 'react';
import Swal from 'sweetalert2';

interface ToastContextType {
  showSuccess: (msg: string, title?: string) => void;
  showError: (msg: string, title?: string) => void;
  showInfo: (msg: string, title?: string) => void;
}

const defaultToastValue: ToastContextType = {
  showSuccess: (msg: string, title?: string) => {
    Swal.fire({
      icon: 'success',
      title: title || 'విజయం (Success)',
      text: msg,
      toast: true,
      position: 'top-end',
      timer: 3000,
      showConfirmButton: false,
    });
  },
  showError: (msg: string, title?: string) => {
    Swal.fire({
      icon: 'error',
      title: title || 'లోపం (Error)',
      text: msg,
      toast: true,
      position: 'top-end',
      timer: 4000,
      showConfirmButton: false,
    });
  },
  showInfo: (msg: string, title?: string) => {
    Swal.fire({
      icon: 'info',
      title: title || 'సమాచారం (Info)',
      text: msg,
      toast: true,
      position: 'top-end',
      timer: 3000,
      showConfirmButton: false,
    });
  },
};

const ToastContext = createContext<ToastContextType>(defaultToastValue);

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ToastContext.Provider value={defaultToastValue}>
      {children}
    </ToastContext.Provider>
  );
};
