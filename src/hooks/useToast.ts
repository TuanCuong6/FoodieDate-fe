import { useState, useCallback } from 'react';

interface ToastMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}

export const useToast = () => {
  const [message, setMessage] = useState<ToastMessage>({ type: 'info', text: '' });

  const showToast = useCallback((type: ToastMessage['type'], text: string) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: 'info', text: '' });
    }, 3000);
  }, []);

  const showSuccess = useCallback((text: string) => showToast('success', text), [showToast]);
  const showError = useCallback((text: string) => showToast('error', text), [showToast]);
  const showInfo = useCallback((text: string) => showToast('info', text), [showToast]);
  const showWarning = useCallback((text: string) => showToast('warning', text), [showToast]);

  return {
    message,
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};
