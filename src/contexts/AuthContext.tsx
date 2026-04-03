import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, coupleService } from '../services';
import { STORAGE_KEYS } from '../constants';
import { store, resetStore } from '../store';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: number | null;
  userName: string;
  userEmail: string;
  coupleId: number | null;
  token: string | null;
  loading: boolean;
  login: (userId: number, name: string, email: string, token: string, coupleId?: number) => void;
  logout: () => void;
  updateCoupleId: (id: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [coupleId, setCoupleId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const storedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      const storedUserName = localStorage.getItem(STORAGE_KEYS.USER_NAME);
      const storedCoupleId = localStorage.getItem(STORAGE_KEYS.COUPLE_ID);

      if (storedToken && storedUserId) {
        setIsAuthenticated(true);
        setUserId(parseInt(storedUserId));
        setUserName(storedUserName || '');
        setToken(storedToken);
        
        if (storedCoupleId) {
          setCoupleId(parseInt(storedCoupleId));
        } else {
          // Chỉ gọi khi chưa có coupleId trong localStorage
          await loadCoupleInfo(parseInt(storedUserId));
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCoupleInfo = async (uid: number) => {
    try {
      const response = await coupleService.getCoupleByUserId(uid);
      if (response.success && response.data) {
        setCoupleId(response.data.id);
        localStorage.setItem(STORAGE_KEYS.COUPLE_ID, response.data.id.toString());
      }
    } catch (error: any) {
      // User chưa có couple - đây là trường hợp bình thường cho user mới
      // Không cần log error, chỉ để coupleId = null
      console.log('User chưa có couple, cần tạo couple mới');
    }
  };

  const login = async (uid: number, name: string, email: string, tkn: string, cid?: number) => {
    setIsAuthenticated(true);
    setUserId(uid);
    setUserName(name);
    setUserEmail(email);
    setToken(tkn);
    
    localStorage.setItem(STORAGE_KEYS.USER_ID, uid.toString());
    localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
    
    if (cid) {
      setCoupleId(cid);
      localStorage.setItem(STORAGE_KEYS.COUPLE_ID, cid.toString());
    } else {
      // Chỉ gọi 1 lần khi login
      await loadCoupleInfo(uid);
    }
  };

  const logout = () => {
    authService.logout();
    
    // Reset Redux store trước
    store.dispatch(resetStore());
    
    // Sau đó reset local state
    setIsAuthenticated(false);
    setUserId(null);
    setUserName('');
    setUserEmail('');
    setCoupleId(null);
    setToken(null);
    
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);
    localStorage.removeItem(STORAGE_KEYS.COUPLE_ID);
  };

  const updateCoupleId = (id: number) => {
    setCoupleId(id);
    localStorage.setItem(STORAGE_KEYS.COUPLE_ID, id.toString());
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        userName,
        userEmail,
        coupleId,
        token,
        loading,
        login,
        logout,
        updateCoupleId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
