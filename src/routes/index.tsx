import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { AuthLayout } from '../components/layout/AuthLayout';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/Dashboard';
import ProfilePage from '../pages/profile/ProfilePage';
import AreasPage from '../pages/areas/AreasPage';
import RestaurantsPage from '../pages/restaurants/RestaurantsPage';
import AddRestaurantPage from '../pages/restaurants/AddRestaurantPage';
import CalendarPage from '../pages/calendar/CalendarPage';
import AddPlanPage from '../pages/AddPlan';
import HistoryPage from '../pages/History';
import AddHistoryPage from '../pages/AddHistory';
import StatisticsPage from '../pages/Statistics';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="areas" element={<AreasPage />} />
        <Route path="restaurants" element={<RestaurantsPage />} />
        <Route path="restaurants/add" element={<AddRestaurantPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="plans/add" element={<AddPlanPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="history/add" element={<AddHistoryPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
