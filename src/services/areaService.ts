import { apiClient, ApiResponse } from './api';

export interface CreateAreaDto {
  coupleId: number;
  name: string;
}

export interface UpdateAreaDto {
  name: string;
}

export interface AreaDto {
  id: number;
  coupleId: number;
  name: string;
  createdAt: string;
}

class AreaService {
  async getAreas(coupleId: number): Promise<ApiResponse<AreaDto[]>> {
    return apiClient.get<AreaDto[]>(`/Areas?coupleId=${coupleId}`);
  }

  async getArea(id: number): Promise<ApiResponse<AreaDto>> {
    return apiClient.get<AreaDto>(`/Areas/${id}`);
  }

  async createArea(dto: CreateAreaDto): Promise<ApiResponse<AreaDto>> {
    return apiClient.post<AreaDto>('/Areas', dto);
  }

  async updateArea(id: number, dto: UpdateAreaDto): Promise<ApiResponse<AreaDto>> {
    return apiClient.put<AreaDto>(`/Areas/${id}`, dto);
  }

  async deleteArea(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/Areas/${id}`);
  }
}

export const areaService = new AreaService();
