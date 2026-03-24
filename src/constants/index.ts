// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  TIMEOUT: 30000,
} as const;

// Restaurant Status
export const RESTAURANT_STATUS = {
  WANT_TO_EAT: 'WantToEat',
  EATEN: 'Eaten',
  DISLIKE: 'Dislike',
  CONSIDERING: 'Considering',
} as const;

// Restaurant Status Config
export const RESTAURANT_STATUS_CONFIG = {
  WantToEat: {
    label: 'Muốn ăn',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
  Eaten: {
    label: 'Đã ăn',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  Dislike: {
    label: 'Không thích',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
  Considering: {
    label: 'Cân nhắc',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  AREAS: '/areas',
  RESTAURANTS: '/restaurants',
  ADD_RESTAURANT: '/restaurants/add',
  CALENDAR: '/calendar',
  STATISTICS: '/statistics',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_ID: 'user_id',
  USER_NAME: 'user_name',
  COUPLE_ID: 'couple_id',
} as const;

// Messages
export const MESSAGES = {
  SUCCESS: {
    AREA_CREATED: 'Thêm khu vực thành công',
    AREA_UPDATED: 'Cập nhật khu vực thành công',
    AREA_DELETED: 'Xóa khu vực thành công',
    RESTAURANT_CREATED: 'Thêm quán ăn thành công',
    RESTAURANT_UPDATED: 'Cập nhật quán ăn thành công',
    RESTAURANT_DELETED: 'Xóa quán ăn thành công',
  },
  ERROR: {
    GENERIC: 'Đã có lỗi xảy ra',
    NETWORK: 'Lỗi kết nối mạng',
    UNAUTHORIZED: 'Bạn cần đăng nhập',
  },
} as const;
