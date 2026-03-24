import { useAppDispatch as useDispatch, useAppSelector as useSelector } from './index';
import { useEffect } from 'react';
import { fetchAreas, createArea as createAreaAction, updateArea as updateAreaAction, deleteArea as deleteAreaAction } from './slices/areasSlice';
import { fetchRestaurants, createRestaurant as createRestaurantAction, updateRestaurant as updateRestaurantAction, deleteRestaurant as deleteRestaurantAction } from './slices/restaurantsSlice';
import { CreateAreaDto, UpdateAreaDto, CreateRestaurantDto, UpdateRestaurantDto, RestaurantStatus } from '../services';

// Re-export typed hooks
export { useAppDispatch, useAppSelector } from './index';

// Areas Hooks
export const useAreas = (coupleId: number | null) => {
  const dispatch = useDispatch();
  const { areas, loading, error } = useSelector((state) => state.areas);

  useEffect(() => {
    if (coupleId) {
      dispatch(fetchAreas(coupleId));
    }
  }, [coupleId, dispatch]);

  const createArea = async (dto: CreateAreaDto) => {
    const result = await dispatch(createAreaAction(dto));
    return !result.type.endsWith('/rejected');
  };

  const updateArea = async (id: number, dto: UpdateAreaDto) => {
    const result = await dispatch(updateAreaAction({ id, dto }));
    return !result.type.endsWith('/rejected');
  };

  const deleteArea = async (id: number) => {
    const result = await dispatch(deleteAreaAction(id));
    return !result.type.endsWith('/rejected');
  };

  return { areas, loading, error, createArea, updateArea, deleteArea };
};

// Restaurants Hooks
export const useRestaurants = (coupleId: number | null, areaId?: number, status?: RestaurantStatus) => {
  const dispatch = useDispatch();
  const { restaurants, loading, error, filters } = useSelector((state) => state.restaurants);

  useEffect(() => {
    if (coupleId) {
      dispatch(fetchRestaurants({ coupleId, areaId, status }));
    }
  }, [coupleId, areaId, status, dispatch]);

  const createRestaurant = async (dto: CreateRestaurantDto) => {
    const result = await dispatch(createRestaurantAction(dto));
    return !result.type.endsWith('/rejected');
  };

  const updateRestaurant = async (id: number, dto: UpdateRestaurantDto) => {
    const result = await dispatch(updateRestaurantAction({ id, dto }));
    return !result.type.endsWith('/rejected');
  };

  const deleteRestaurant = async (id: number) => {
    const result = await dispatch(deleteRestaurantAction(id));
    return !result.type.endsWith('/rejected');
  };

  return { restaurants, loading, error, filters, createRestaurant, updateRestaurant, deleteRestaurant };
};

// Auth Hooks
export const useAuth = () => {
  const { isAuthenticated, userId, userName, coupleId, loading, error } = useSelector((state) => state.auth);
  return { isAuthenticated, userId, userName, coupleId, loading, error };
};
