import { apiClient, ApiResponse } from "./api";

export enum CoupleStatus {
  Pending = 0,
  Active = 1,
  Rejected = 2,
}

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
  status: CoupleStatus;
  createdAt: string;
  user1: UserInfo;
  user2: UserInfo;
}

class CoupleService {
  async createCouple(dto: CreateCoupleDto): Promise<ApiResponse<CoupleDetail>> {
    return apiClient.post<CoupleDetail>("/Couple", dto);
  }

  async getCoupleByUserId(userId: number): Promise<ApiResponse<CoupleDetail>> {
    return apiClient.get<CoupleDetail>(`/Couple/user/${userId}`);
  }

  async updateCouple(
    coupleId: number,
    dto: UpdateCoupleDto,
  ): Promise<ApiResponse<CoupleDetail>> {
    return apiClient.put<CoupleDetail>(`/Couple/${coupleId}`, dto);
  }

  async deleteCouple(coupleId: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/Couple/${coupleId}`);
  }

  async sendInvitation(
    userId: number,
    dto: InvitationDto,
  ): Promise<ApiResponse<InvitationResponse>> {
    return apiClient.post<InvitationResponse>(
      `/Couple/invite?userId=${userId}`,
      dto,
    );
  }

  async getPendingInvitation(
    userId: number,
  ): Promise<ApiResponse<CoupleDetail>> {
    return apiClient.get<CoupleDetail>(`/Couple/pending-invitation/${userId}`);
  }

  async getSentInvitation(userId: number): Promise<ApiResponse<CoupleDetail>> {
    return apiClient.get<CoupleDetail>(`/Couple/sent-invitation/${userId}`);
  }

  async getPendingInvitations(
    userId: number,
  ): Promise<ApiResponse<CoupleDetail[]>> {
    return apiClient.get<CoupleDetail[]>(
      `/Couple/pending-invitations/${userId}`,
    );
  }

  async getSentInvitations(
    userId: number,
  ): Promise<ApiResponse<CoupleDetail[]>> {
    return apiClient.get<CoupleDetail[]>(`/Couple/sent-invitations/${userId}`);
  }

  async acceptInvitation(
    coupleId: number,
    userId: number,
  ): Promise<ApiResponse<InvitationResponse>> {
    return apiClient.post<InvitationResponse>(
      `/Couple/${coupleId}/accept?userId=${userId}`,
      {},
    );
  }

  async rejectInvitation(
    coupleId: number,
    userId: number,
  ): Promise<ApiResponse<InvitationResponse>> {
    return apiClient.post<InvitationResponse>(
      `/Couple/${coupleId}/reject?userId=${userId}`,
      {},
    );
  }

  async cancelInvitation(
    coupleId: number,
    userId: number,
  ): Promise<ApiResponse<InvitationResponse>> {
    return apiClient.post<InvitationResponse>(
      `/Couple/${coupleId}/cancel?userId=${userId}`,
      {},
    );
  }
}

export const coupleService = new CoupleService();
