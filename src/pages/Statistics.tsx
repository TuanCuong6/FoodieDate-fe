import { useEffect, useState } from 'react';
import {
  TrendingUp,
  MapPin,
  Star,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import statisticsService, {
  AreaStatsDto,
  MonthlyVisitStatsDto,
  RestaurantStatsDto,
} from '../services/statisticsService';

export default function Statistics() {
  const { coupleId } = useAuth();

  const [topRestaurants, setTopRestaurants] = useState<RestaurantStatsDto[]>([]);
  const [areaStats, setAreaStats] = useState<AreaStatsDto[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyVisitStatsDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (coupleId) {
      loadStatistics();
    }
  }, [coupleId]);

  const loadStatistics = async () => {
    if (!coupleId) return;

    try {
      setLoading(true);
      const [restaurants, areas, monthly] = await Promise.all([
        statisticsService.getTopRestaurants(coupleId, 10),
        statisticsService.getAreaStats(coupleId),
        statisticsService.getMonthlyVisitStats(coupleId, 6),
      ]);

      setTopRestaurants(restaurants);
      setAreaStats(areas);
      setMonthlyStats(monthly);
    } catch (error) {
      console.error('Failed to load statistics:', error);
      // Don't block rendering, just show empty states
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  // Safe calculation after loading check
  const maxMonthlyVisits = monthlyStats && monthlyStats.length > 0 
    ? Math.max(...monthlyStats.map((m) => m.visitCount), 1)
    : 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Thống kê</h1>
        <p className="text-gray-600 mt-1">
          Phân tích thói quen ăn uống của bạn
        </p>
      </div>

      {/* Top Restaurants */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-rose-500" />
          <span>Top 10 quán ăn yêu thích</span>
        </h2>

        {!topRestaurants || topRestaurants.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chưa có dữ liệu thống kê</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topRestaurants.map((restaurant, index) => (
              <div
                key={restaurant.restaurantId}
                className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {restaurant.restaurantName}
                  </h3>
                  <p className="text-sm text-gray-500">{restaurant.areaName}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">
                      {restaurant.visitCount} lần
                    </span>
                  </div>
                  {restaurant.averageRating && (
                    <div className="flex items-center justify-end space-x-1">
                      {renderStars(Math.round(restaurant.averageRating))}
                      <span className="text-sm text-gray-600 ml-1">
                        {restaurant.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-blue-500" />
            <span>Thống kê theo khu vực</span>
          </h2>

          {!areaStats || areaStats.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có dữ liệu</p>
            </div>
          ) : (
            <div className="space-y-3">
              {areaStats.map((area) => (
                <div
                  key={area.areaId}
                  className="p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{area.areaName}</h3>
                    <span className="text-sm text-gray-500">
                      {area.restaurantCount} quán
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                        style={{
                          width: `${
                            areaStats && areaStats.length > 0
                              ? (area.visitCount /
                                  Math.max(...areaStats.map((a) => a.visitCount), 1)) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {area.visitCount} lần
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly Visits Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-emerald-500" />
            <span>Lịch sử 6 tháng gần đây</span>
          </h2>

          {!monthlyStats || monthlyStats.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có dữ liệu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {monthlyStats.map((month) => (
                <div key={`${month.year}-${month.month}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {month.monthName}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {month.visitCount} lần
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all"
                        style={{
                          width: `${(month.visitCount / maxMonthlyVisits) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
