import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService, coupleService, LoginDto, RegisterDto } from '../../services';
import { STORAGE_KEYS } from '../../constants';

interface AuthState {
  isAuthenticated: boolean;
  userId: number | null;
  userName: string;
  userEmail: string;
  coupleId: number | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  userName: '',
  userEmail: '',
  coupleId: null,
  token: null,
  loading: false,
  error: null,
};

// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginDto, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Đăng nhập thất bại');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterDto, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Đăng ký thất bại');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadCoupleInfo = createAsyncThunk(
  'auth/loadCoupleInfo',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await coupleService.getCoupleByUserId(userId);
      if (response.success && response.data) {
        return response.data.id;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.isAuthenticated = false;
      state.userId = null;
      state.userName = '';
      state.userEmail = '';
      state.coupleId = null;
      state.token = null;
      localStorage.removeItem(STORAGE_KEYS.USER_ID);
      localStorage.removeItem(STORAGE_KEYS.USER_NAME);
      localStorage.removeItem(STORAGE_KEYS.COUPLE_ID);
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      const userName = localStorage.getItem(STORAGE_KEYS.USER_NAME);
      const coupleId = localStorage.getItem(STORAGE_KEYS.COUPLE_ID);

      if (token && userId) {
        state.isAuthenticated = true;
        state.userId = parseInt(userId);
        state.userName = userName || '';
        state.coupleId = coupleId ? parseInt(coupleId) : null;
        state.token = token;
      }
    },
    setCoupleId: (state, action: PayloadAction<number>) => {
      state.coupleId = action.payload;
      localStorage.setItem(STORAGE_KEYS.COUPLE_ID, action.payload.toString());
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userId = action.payload.userId;
        state.userName = action.payload.name;
        state.userEmail = action.payload.email;
        state.token = action.payload.token;
        state.coupleId = action.payload.couple?.id || null;
        
        localStorage.setItem(STORAGE_KEYS.USER_ID, action.payload.userId.toString());
        localStorage.setItem(STORAGE_KEYS.USER_NAME, action.payload.name);
        if (action.payload.couple) {
          localStorage.setItem(STORAGE_KEYS.COUPLE_ID, action.payload.couple.id.toString());
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userId = action.payload.userId;
        state.userName = action.payload.name;
        state.userEmail = action.payload.email;
        state.token = action.payload.token;
        state.coupleId = action.payload.couple?.id || null;
        
        localStorage.setItem(STORAGE_KEYS.USER_ID, action.payload.userId.toString());
        localStorage.setItem(STORAGE_KEYS.USER_NAME, action.payload.name);
        if (action.payload.couple) {
          localStorage.setItem(STORAGE_KEYS.COUPLE_ID, action.payload.couple.id.toString());
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Load Couple Info
    builder.addCase(loadCoupleInfo.fulfilled, (state, action) => {
      if (action.payload) {
        state.coupleId = action.payload;
        localStorage.setItem(STORAGE_KEYS.COUPLE_ID, action.payload.toString());
      }
    });
  },
});

export const { logout, initializeAuth, setCoupleId } = authSlice.actions;
export default authSlice.reducer;
