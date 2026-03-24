import { useState, useEffect, useCallback } from 'react';
import { areaService, AreaDto, CreateAreaDto, UpdateAreaDto } from '../services';

export const useAreas = (coupleId: number | null) => {
  const [areas, setAreas] = useState<AreaDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAreas = useCallback(async () => {
    if (!coupleId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await areaService.getAreas(coupleId);
      if (response.success && response.data) {
        setAreas(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách khu vực');
    } finally {
      setLoading(false);
    }
  }, [coupleId]);

  useEffect(() => {
    loadAreas();
  }, [loadAreas]);

  const createArea = async (dto: CreateAreaDto): Promise<boolean> => {
    try {
      const response = await areaService.createArea(dto);
      if (response.success && response.data) {
        setAreas([...areas, response.data]);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const updateArea = async (id: number, dto: UpdateAreaDto): Promise<boolean> => {
    try {
      const response = await areaService.updateArea(id, dto);
      if (response.success && response.data) {
        setAreas(areas.map(a => a.id === id ? response.data! : a));
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const deleteArea = async (id: number): Promise<boolean> => {
    try {
      const response = await areaService.deleteArea(id);
      if (response.success) {
        setAreas(areas.filter(a => a.id !== id));
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    areas,
    loading,
    error,
    loadAreas,
    createArea,
    updateArea,
    deleteArea,
  };
};
