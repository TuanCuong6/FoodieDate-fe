import { useUI } from '../../contexts';
import { Toast } from './Toast';

export const GlobalToast = () => {
  const { toast } = useUI();

  if (!toast) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <Toast type={toast.type} message={toast.message} />
    </div>
  );
};
