import { apiClient, ApiResponse } from './api';

export type RestaurantStatus = 'WantToEat' | 'Eaten' | 'Dislike' | 'Considering';

export interface CreateRestaurantDto {
  coupleId: number;
  areaId: number;
  name: string;
  address?: string;
  phone?: string;
  source?: string;
  sourceUrl?: string;
  notes?: string;
  status: RestaurantStatus;
}

export interface UpdateRestaurantDto {
  areaId?: number;
  name?: string;
  address?: string;
  phone?: string;
  source?: string;
  sourceUrl?: string;
  notes?: string;
  status?: RestaurantStatus;
}

export interface RestaurantDto {
  id: number;
  coupleId: number;
  areaId: number;
  areaName: string;
  name: string;
  address?: string;
  phone?: string;
  source?: string;
  sourceUrl?: string;
  notes?: string;
  status: RestaurantStatus;
  createdBy: number;
  lastVisitDate?: string;
  createdAt: string;
}

class RestaurantService {
  async getRestaurants(
    coupleId: number,
    areaId?: number,
    status?: RestaurantStatus
  ): Promise<ApiResponse<RestaurantDto[]>> {
    let url = `/Restaurants?coupleId=${coupleId}`;
    if (areaId) url += `&areaId=${areaId}`;
    if (status) url += `&status=${status}`;
    return apiClient.get<RestaurantDto[]>(url);
  }

  async getRestaurant(id: number): Promise<ApiResponse<RestaurantDto>> {
    return apiClient.get<RestaurantDto>(`/Restaurants/${id}`);
  }

  async createRestaurant(dto: CreateRestaurantDto): Promise<ApiResponse<RestaurantDto>> {
    return apiClient.post<RestaurantDto>('/Restaurants', dto);
  }

  async updateRestaurant(id: number, dto: UpdateRestaurantDto): Promise<ApiResponse<RestaurantDto>> {
    return apiClient.put<RestaurantDto>(`/Restaurants/${id}`, dto);
  }

  async deleteRestaurant(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/Restaurants/${id}`);
  }
}

export const restaurantService = new RestaurantService();
