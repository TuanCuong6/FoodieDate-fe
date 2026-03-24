import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ToastMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface UIContextType {
  toast: ToastMessage | null;
  showToast: (type: ToastMessage['type'], message: string) => void;
  hideToast: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider = ({ children }: UIProviderProps) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

  const showToast = useCallback((type: ToastMessage['type'], message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <UIContext.Provider
      value={{
        toast,
        showToast,
        hideToast,
        isModalOpen,
        openModal,
        closeModal,
        globalLoading,
        setGlobalLoading,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
