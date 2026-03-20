import { apiClient, ApiResponse } from './api';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: number;
  name: string;
  email: string;
  token: string;
  couple: CoupleInfo | null;
}

export interface CoupleInfo {
  id: number;
  user1Id: number;
  user2Id: number;
  coupleName?: string;
}

class AuthService {
  async register(dto: RegisterDto): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/Auth/register', dto);
    if (response.data?.token) {
      apiClient.setToken(response.data.token);
    }
    return response;
  }

  async login(dto: LoginDto): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/Auth/login', dto);
    if (response.data?.token) {
      apiClient.setToken(response.data.token);
    }
    return response;
  }

  async checkEmail(email: string): Promise<ApiResponse<boolean>> {
    return apiClient.get<boolean>(`/Auth/check-email?email=${encodeURIComponent(email)}`);
  }

  logout() {
    apiClient.clearToken();
  }
}

export const authService = new AuthService();
