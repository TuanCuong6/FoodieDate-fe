import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts';

export const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-orange-100 flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
};
