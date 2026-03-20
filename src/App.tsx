import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Restaurants from './pages/Restaurants';
import Calendar from './pages/Calendar';
import Statistics from './pages/Statistics';
import AddRestaurant from './pages/AddRestaurant';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDetail from './components/RestaurantDetail';
import { Restaurant } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    const storedUserId = localStorage.getItem('user_id');
    const storedUserName = localStorage.getItem('user_name');
    
    if (token && storedUserId) {
      setIsAuthenticated(true);
      setUserId(parseInt(storedUserId));
      setUserName(storedUserName || '');
    }
  }, []);

  const handleLoginSuccess = (id: number, name: string) => {
    setIsAuthenticated(true);
    setUserId(id);
    setUserName(name);
    localStorage.setItem('user_id', id.toString());
    localStorage.setItem('user_name', name);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setUserName('');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    setCurrentPage('dashboard');
  };

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <Register
          onRegisterSuccess={handleLoginSuccess}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'restaurants':
        return <Restaurants onSelectRestaurant={setSelectedRestaurant} />;
      case 'calendar':
        return <Calendar />;
      case 'statistics':
        return <Statistics />;
      case 'add-restaurant':
        return <AddRestaurant onNavigate={setCurrentPage} />;
      case 'profile':
        return <Profile userId={userId!} onLogout={handleLogout} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <Layout 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        userName={userName}
      >
        {renderPage()}
      </Layout>

      {selectedRestaurant && (
        <RestaurantDetail
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}
    </>
  );
}

export default App;
