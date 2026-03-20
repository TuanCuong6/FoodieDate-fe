import { apiClient, ApiResponse } from './api';

export interface CreateCoupleDto {
  user1Id: number;
  user2Id: number;
  coupleName?: string;
}

export interface UpdateCoupleDto {
  coupleName?: string;
}

export interface InvitationDto {
  partnerEmail: string;
  coupleName?: string;
}

export interface InvitationResponse {
  success: boolean;
  message: string;
  invitationCode?: string;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
}

export interface CoupleDetail {
  id: number;
  user1Id: number;
  user2Id: number;
  coupleName?: string;
  createdAt: string;
  user1: UserInfo;
  user2: UserInfo;
}

class CoupleService {
  async createCouple(dto: CreateCoupleDto): Promise<ApiResponse<CoupleDetail>> {
    return apiClient.post<CoupleDetail>('/Couple', dto);
  }

  async getCoupleByUserId(userId: number): Promise<ApiResponse<CoupleDetail>> {
    return apiClient.get<CoupleDetail>(`/Couple/user/${userId}`);
  }

  async updateCouple(coupleId: number, dto: UpdateCoupleDto): Promise<ApiResponse<CoupleDetail>> {
    return apiClient.put<CoupleDetail>(`/Couple/${coupleId}`, dto);
  }

  async deleteCouple(coupleId: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/Couple/${coupleId}`);
  }

  async sendInvitation(userId: number, dto: InvitationDto): Promise<ApiResponse<InvitationResponse>> {
    return apiClient.post<InvitationResponse>(`/Couple/invite?userId=${userId}`, dto);
  }
}

export const coupleService = new CoupleService();
