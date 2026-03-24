import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { GlobalToast } from '../common/GlobalToast';
import { GlobalLoading } from '../common/GlobalLoading';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <GlobalToast />
      <GlobalLoading />
    </div>
  );
};
