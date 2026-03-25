import { apiClient } from './api';

// Types
export interface DashboardStatsDto {
  totalRestaurants: number;
  totalAreas: number;
  totalVisits: number;
  upcomingPlans: number;
  wantToEatCount: number;
  eatenCount: number;
  averageRating?: number;
  totalPlans: number;
}

export interface RestaurantStatsDto {
  restaurantId: number;
  restaurantName: string;
  areaName: string;
  visitCount: number;
  averageRating?: number;
  lastVisitDate?: string;
}

export interface AreaStatsDto {
  areaId: number;
  areaName: string;
  restaurantCount: number;
  visitCount: number;
}

export interface MonthlyVisitStatsDto {
  year: number;
  month: number;
  monthName: string;
  visitCount: number;
}

class StatisticsService {
  private readonly baseUrl = '/statistics';

  async getDashboardStats(coupleId: number): Promise<DashboardStatsDto> {
    const response = await apiClient.get<{ data: DashboardStatsDto }>(
      `${this.baseUrl}/dashboard/${coupleId}`
    );
    return response.data!.data;
  }

  async getTopRestaurants(coupleId: number, count: number = 10): Promise<RestaurantStatsDto[]> {
    const response = await apiClient.get<{ data: RestaurantStatsDto[] }>(
      `${this.baseUrl}/top-restaurants/${coupleId}?count=${count}`
    );
    return response.data!.data;
  }

  async getAreaStats(coupleId: number): Promise<AreaStatsDto[]> {
    const response = await apiClient.get<{ data: AreaStatsDto[] }>(
      `${this.baseUrl}/areas/${coupleId}`
    );
    return response.data!.data;
  }

  async getMonthlyVisitStats(coupleId: number, months: number = 12): Promise<MonthlyVisitStatsDto[]> {
    const response = await apiClient.get<{ data: MonthlyVisitStatsDto[] }>(
      `${this.baseUrl}/monthly-visits/${coupleId}?months=${months}`
    );
    return response.data!.data;
  }
}

export default new StatisticsService();
