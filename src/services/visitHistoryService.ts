import { apiClient } from './api';

// Types
export interface VisitHistoryDto {
  id: number;
  coupleId: number;
  restaurantId: number;
  restaurantName: string;
  restaurantAddress?: string;
  areaName: string;
  visitDate: string;
  rating?: number;
  review?: string;
  notes?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateVisitHistoryDto {
  coupleId: number;
  restaurantId: number;
  visitDate: string;
  rating?: number;
  review?: string;
  notes?: string;
  photoUrl?: string;
}

export interface UpdateVisitHistoryDto {
  visitDate: string;
  rating?: number;
  review?: string;
  notes?: string;
  photoUrl?: string;
}

class VisitHistoryService {
  private readonly baseUrl = '/visithistories';

  async getAll(): Promise<VisitHistoryDto[]> {
    const response = await apiClient.get<{ data: VisitHistoryDto[] }>(this.baseUrl);
    return response.data!.data;
  }

  async getById(id: number): Promise<VisitHistoryDto> {
    const response = await apiClient.get<{ data: VisitHistoryDto }>(`${this.baseUrl}/${id}`);
    return response.data!.data;
  }

  async getByCoupleId(coupleId: number): Promise<VisitHistoryDto[]> {
    const response = await apiClient.get<{ data: VisitHistoryDto[] }>(`${this.baseUrl}/couple/${coupleId}`);
    return response.data!.data;
  }

  async getByRestaurantId(restaurantId: number): Promise<VisitHistoryDto[]> {
    const response = await apiClient.get<{ data: VisitHistoryDto[] }>(`${this.baseUrl}/restaurant/${restaurantId}`);
    return response.data!.data;
  }

  async getRecentVisits(coupleId: number, count: number = 10): Promise<VisitHistoryDto[]> {
    const response = await apiClient.get<{ data: VisitHistoryDto[] }>(
      `${this.baseUrl}/couple/${coupleId}/recent?count=${count}`
    );
    return response.data!.data;
  }

  async create(dto: CreateVisitHistoryDto): Promise<VisitHistoryDto> {
    const response = await apiClient.post<{ data: VisitHistoryDto }>(this.baseUrl, dto);
    return response.data!.data;
  }

  async update(id: number, dto: UpdateVisitHistoryDto): Promise<VisitHistoryDto> {
    const response = await apiClient.put<{ data: VisitHistoryDto }>(`${this.baseUrl}/${id}`, dto);
    return response.data!.data;
  }

  async delete(id: number): Promise<boolean> {
    const response = await apiClient.delete<{ data: boolean }>(`${this.baseUrl}/${id}`);
    return response.data!.data;
  }
}

export default new VisitHistoryService();
