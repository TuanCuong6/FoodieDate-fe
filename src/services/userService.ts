import { apiClient, ApiResponse } from './api';

export interface UpdateProfileDto {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  hasCouple: boolean;
}

class UserService {
  async getProfile(userId: number): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>(`/User/${userId}`);
  }

  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<ApiResponse<UserProfile>> {
    return apiClient.put<UserProfile>(`/User/${userId}`, dto);
  }
}

export const userService = new UserService();
