import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  MapPin,
  Calendar,
  Heart,
  PlusCircle,
  Menu,
  X,
  BarChart3,
  User,
} from 'lucide-react';
import { useAuth } from '../../contexts';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { userName } = useAuth();

  const navigation = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Khu vực', icon: MapPin, path: '/areas' },
    { name: 'Quán ăn', icon: MapPin, path: '/restaurants' },
    { name: 'Lịch hẹn', icon: Calendar, path: '/calendar' },
    { name: 'Thống kê', icon: BarChart3, path: '/statistics' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-rose-500 to-orange-500 p-2 rounded-xl">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                Foodie Date
              </h1>
              <p className="text-xs text-gray-500">Yêu & Ăn Ngon</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    active
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/restaurants/add"
              className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Thêm quán</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
              title="Profile"
            >
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">{userName || 'Profile'}</span>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    active
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'
                      : 'text-gray-600 hover:bg-rose-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Link
              to="/restaurants/add"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-3 py-2 rounded-lg"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Thêm quán</span>
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center space-x-2 text-gray-600 hover:bg-rose-50 px-3 py-2 rounded-lg"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
