import { useState, useEffect, useCallback } from 'react';
import { restaurantService, RestaurantDto, CreateRestaurantDto, UpdateRestaurantDto, RestaurantStatus } from '../services';

export const useRestaurants = (
  coupleId: number | null,
  areaId?: number,
  status?: RestaurantStatus
) => {
  const [restaurants, setRestaurants] = useState<RestaurantDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRestaurants = useCallback(async () => {
    if (!coupleId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await restaurantService.getRestaurants(coupleId, areaId, status);
      if (response.success && response.data) {
        setRestaurants(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách quán ăn');
    } finally {
      setLoading(false);
    }
  }, [coupleId, areaId, status]);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  const createRestaurant = async (dto: CreateRestaurantDto): Promise<boolean> => {
    try {
      const response = await restaurantService.createRestaurant(dto);
      if (response.success && response.data) {
        setRestaurants([...restaurants, response.data]);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const updateRestaurant = async (id: number, dto: UpdateRestaurantDto): Promise<boolean> => {
    try {
      const response = await restaurantService.updateRestaurant(id, dto);
      if (response.success && response.data) {
        setRestaurants(restaurants.map(r => r.id === id ? response.data! : r));
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const deleteRestaurant = async (id: number): Promise<boolean> => {
    try {
      const response = await restaurantService.deleteRestaurant(id);
      if (response.success) {
        setRestaurants(restaurants.filter(r => r.id !== id));
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    restaurants,
    loading,
    error,
    loadRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
  };
};
