import { apiClient, ApiResponse } from './api';

export interface PlanDto {
  id: number;
  coupleId: number;
  restaurantId: number;
  restaurantName: string;
  restaurantAddress?: string;
  restaurantPhone?: string;
  planDate: string; // ISO date string
  planTime?: string; // "HH:mm" format
  notes?: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePlanDto {
  coupleId: number;
  restaurantId: number;
  planDate: string; // ISO date string
  planTime?: string;
  notes?: string;
}

export interface UpdatePlanDto {
  planDate?: string;
  planTime?: string;
  notes?: string;
  status?: 'Upcoming' | 'Completed' | 'Cancelled';
}

class PlanService {
  async getPlanById(id: number): Promise<ApiResponse<PlanDto>> {
    return apiClient.get<PlanDto>(`/Plans/${id}`);
  }

  async getPlansByCoupleId(
    coupleId: number,
    status?: string
  ): Promise<ApiResponse<PlanDto[]>> {
    const query = status ? `?status=${status}` : '';
    return apiClient.get<PlanDto[]>(`/Plans/couple/${coupleId}${query}`);
  }

  async getUpcomingPlans(coupleId: number): Promise<ApiResponse<PlanDto[]>> {
    return apiClient.get<PlanDto[]>(`/Plans/couple/${coupleId}/upcoming`);
  }

  async getPlansByDateRange(
    coupleId: number,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<PlanDto[]>> {
    return apiClient.get<PlanDto[]>(
      `/Plans/couple/${coupleId}/date-range?startDate=${startDate}&endDate=${endDate}`
    );
  }

  async createPlan(dto: CreatePlanDto): Promise<ApiResponse<PlanDto>> {
    return apiClient.post<PlanDto>('/Plans', dto);
  }

  async updatePlan(id: number, dto: UpdatePlanDto): Promise<ApiResponse<PlanDto>> {
    return apiClient.put<PlanDto>(`/Plans/${id}`, dto);
  }

  async deletePlan(id: number): Promise<ApiResponse<boolean>> {
    return apiClient.delete<boolean>(`/Plans/${id}`);
  }

  async markAsCompleted(id: number): Promise<ApiResponse<PlanDto>> {
    return apiClient.post<PlanDto>(`/Plans/${id}/complete`);
  }

  async markAsCancelled(id: number): Promise<ApiResponse<PlanDto>> {
    return apiClient.post<PlanDto>(`/Plans/${id}/cancel`);
  }

  async randomRestaurant(coupleId: number): Promise<ApiResponse<number>> {
    return apiClient.post<number>(`/Plans/couple/${coupleId}/random`);
  }
}

export const planService = new PlanService();
