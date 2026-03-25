import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  History,
  Star,
  TrendingUp,
  Heart,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRecentVisits } from '../store/slices/visitHistoriesSlice';
import { fetchUpcomingPlans } from '../store/slices/plansSlice';
import statisticsService, { DashboardStatsDto, RestaurantStatsDto } from '../services/statisticsService';

export default function Dashboard() {
  const navigate = useNavigate();
  const { coupleId, userName } = useAuth();
  const dispatch = useAppDispatch();

  const { visitHistories } = useAppSelector((state) => state.visitHistories || { visitHistories: [] });
  const { plans } = useAppSelector((state) => state.plans);

  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const [topRestaurants, setTopRestaurants] = useState<RestaurantStatsDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (coupleId) {
      loadDashboardData();
    }
  }, [coupleId]);

  const loadDashboardData = async () => {
    if (!coupleId) return;

    try {
      setLoading(true);
      
      // Load stats
      const statsData = await statisticsService.getDashboardStats(coupleId);
      setStats(statsData);

      // Load top restaurants
      const topRestaurantsData = await statisticsService.getTopRestaurants(coupleId, 5);
      setTopRestaurants(topRestaurantsData);

      // Load recent visits
      dispatch(fetchRecentVisits({ coupleId, count: 5 }));

      // Load upcoming plans
      dispatch(fetchUpcomingPlans(coupleId));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Don't block rendering on error, just log it
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
            className={`w-3 h-3 ${
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

  // Safe access to plans and visitHistories
  const allPlans = plans || [];
  const allVisits = visitHistories || [];
  const upcomingPlans = allPlans.filter((p) => p.status === 'Upcoming').slice(0, 5);
  const recentVisits = allVisits.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Xin chào, {userName}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Chào mừng trở lại với Foodie Date</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <MapPin className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-60" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalRestaurants}</h3>
            <p className="text-sm opacity-90">Quán ăn</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 opacity-80" />
              <Clock className="w-5 h-5 opacity-60" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.upcomingPlans}</h3>
            <p className="text-sm opacity-90">Lịch hẹn sắp tới</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <History className="w-8 h-8 opacity-80" />
              <CheckCircle className="w-5 h-5 opacity-60" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalVisits}</h3>
            <p className="text-sm opacity-90">Lần đã ăn</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-60" />
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}
            </h3>
            <p className="text-sm opacity-90">Đánh giá TB</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Plans */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-purple-500" />
              <span>Lịch hẹn sắp tới</span>
            </h2>
            <button
              onClick={() => navigate('/calendar')}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Xem tất cả →
            </button>
          </div>

          {upcomingPlans.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có lịch hẹn nào</p>
              <button
                onClick={() => navigate('/plans/add')}
                className="mt-3 text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                Tạo lịch hẹn mới
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => navigate('/calendar')}
                  className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {plan.restaurantName}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(plan.planDate).toLocaleDateString('vi-VN')}
                        </span>
                        {plan.planTime && (
                          <>
                            <span>•</span>
                            <Clock className="w-4 h-4" />
                            <span>{plan.planTime}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Visits */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <History className="w-6 h-6 text-emerald-500" />
              <span>Lịch sử gần đây</span>
            </h2>
            <button
              onClick={() => navigate('/history')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Xem tất cả →
            </button>
          </div>

          {recentVisits.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có lịch sử nào</p>
              <button
                onClick={() => navigate('/history/add')}
                className="mt-3 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
              >
                Thêm lịch sử mới
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentVisits.map((visit) => (
                <div
                  key={visit.id}
                  onClick={() => navigate('/history')}
                  className="p-4 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {visit.restaurantName}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">
                          {new Date(visit.visitDate).toLocaleDateString('vi-VN')}
                        </span>
                        {visit.rating && (
                          <>
                            <span className="text-gray-400">•</span>
                            {renderStars(visit.rating)}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Restaurants */}
      {topRestaurants && topRestaurants.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Heart className="w-6 h-6 text-rose-500" />
              <span>Quán ăn yêu thích</span>
            </h2>
            <button
              onClick={() => navigate('/statistics')}
              className="text-sm text-rose-600 hover:text-rose-700 font-medium"
            >
              Xem thống kê →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topRestaurants.map((restaurant, index) => (
              <div
                key={restaurant.restaurantId}
                className="p-4 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 cursor-pointer transition-all"
                onClick={() => navigate('/restaurants')}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-rose-500">
                      #{index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {restaurant.restaurantName}
                      </h3>
                      <p className="text-xs text-gray-500">{restaurant.areaName}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <History className="w-4 h-4" />
                    <span>{restaurant.visitCount} lần</span>
                  </div>
                  {restaurant.averageRating && (
                    <div className="flex items-center space-x-1">
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
        </div>
      )}

      {/* Quick Actions */}
      {stats && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Thống kê nhanh</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.wantToEatCount}
              </div>
              <div className="text-sm text-gray-600 mt-1">Muốn ăn</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {stats.eatenCount}
              </div>
              <div className="text-sm text-gray-600 mt-1">Đã ăn</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalAreas}
              </div>
              <div className="text-sm text-gray-600 mt-1">Khu vực</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.totalPlans}
              </div>
              <div className="text-sm text-gray-600 mt-1">Tổng lịch hẹn</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
