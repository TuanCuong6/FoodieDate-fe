import {
  TrendingUp,
  MapPin,
  DollarSign,
  Star,
  Calendar,
  Heart,
  Utensils,
  Award,
  BarChart3,
} from 'lucide-react';
import { restaurants, reviews, statistics, areas } from '../data/mockData';

export default function Statistics() {
  const restaurantsByArea = areas.map((area) => ({
    name: area.name,
    count: restaurants.filter((r) => r.area.id === area.id).length,
  }));

  const topRatedRestaurants = [...restaurants]
    .filter((r) => r.rating)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  const monthlyStats = [
    { month: 'T1', visits: 3, spent: 450000 },
    { month: 'T2', visits: 5, spent: 680000 },
    { month: 'T3', visits: 4, spent: 575000 },
  ];

  const maxVisits = Math.max(...monthlyStats.map((m) => m.visits));
  const maxSpent = Math.max(...monthlyStats.map((m) => m.spent));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Thống kê</h1>
        <p className="text-gray-600 mt-1">
          Xem tổng quan hành trình ẩm thực của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <MapPin className="w-8 h-8 opacity-80" />
            <BarChart3 className="w-6 h-6 opacity-60" />
          </div>
          <p className="text-blue-100 text-sm font-medium">Tổng quán</p>
          <p className="text-4xl font-bold mt-2">{statistics.totalRestaurants}</p>
          <p className="text-blue-100 text-xs mt-2">
            +3 so với tháng trước
          </p>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Heart className="w-8 h-8 opacity-80" fill="currentColor" />
            <TrendingUp className="w-6 h-6 opacity-60" />
          </div>
          <p className="text-rose-100 text-sm font-medium">Muốn thử</p>
          <p className="text-4xl font-bold mt-2">{statistics.wantToEat}</p>
          <p className="text-rose-100 text-xs mt-2">
            Đang chờ khám phá
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Utensils className="w-8 h-8 opacity-80" />
            <Calendar className="w-6 h-6 opacity-60" />
          </div>
          <p className="text-emerald-100 text-sm font-medium">Đã ăn</p>
          <p className="text-4xl font-bold mt-2">{statistics.eaten}</p>
          <p className="text-emerald-100 text-xs mt-2">
            Kỷ niệm tuyệt vời
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-6 h-6 opacity-60" />
          </div>
          <p className="text-amber-100 text-sm font-medium">Tổng chi</p>
          <p className="text-4xl font-bold mt-2">
            {(statistics.totalSpent / 1000).toFixed(0)}k
          </p>
          <p className="text-amber-100 text-xs mt-2">
            Đầu tư cho hạnh phúc
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-blue-500" />
            <span>Phân bố theo khu vực</span>
          </h2>

          <div className="space-y-4">
            {restaurantsByArea
              .filter((area) => area.count > 0)
              .sort((a, b) => b.count - a.count)
              .map((area) => {
                const percentage =
                  (area.count / statistics.totalRestaurants) * 100;
                return (
                  <div key={area.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">
                        {area.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {area.count} quán
                      </span>
                    </div>
                    <div className="bg-gray-100 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>Top quán được đánh giá cao</span>
          </h2>

          <div className="space-y-4">
            {topRatedRestaurants.map((restaurant, index) => (
              <div
                key={restaurant.id}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <img
                  src={restaurant.images[0]}
                  alt={restaurant.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {restaurant.name}
                  </p>
                  <p className="text-sm text-gray-600">{restaurant.area.name}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="font-bold text-gray-900">
                    {restaurant.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-emerald-500" />
          <span>Hoạt động theo tháng</span>
        </h2>

        <div className="grid grid-cols-3 gap-8">
          {monthlyStats.map((stat) => (
            <div key={stat.month}>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-1">{stat.month}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.visits}</p>
                <p className="text-xs text-gray-500">lần đi ăn</p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Số lượt đi</p>
                  <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                      style={{ width: `${(stat.visits / maxVisits) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Chi tiêu</p>
                  <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                      style={{ width: `${(stat.spent / maxSpent) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1 text-right">
                    {(stat.spent / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <Star className="w-8 h-8 text-purple-500" />
            <span className="text-3xl">⭐</span>
          </div>
          <p className="text-sm text-purple-700 font-medium">Đánh giá TB</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">
            {statistics.averageRating.toFixed(1)}/5
          </p>
          <p className="text-purple-600 text-xs mt-2">
            Từ {reviews.length} đánh giá
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-green-500" />
            <span className="text-3xl">📅</span>
          </div>
          <p className="text-sm text-green-700 font-medium">Lịch hẹn</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {statistics.upcomingPlans}
          </p>
          <p className="text-green-600 text-xs mt-2">
            Sắp tới
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <Heart className="w-8 h-8 text-orange-500" fill="currentColor" />
            <span className="text-3xl">❤️</span>
          </div>
          <p className="text-sm text-orange-700 font-medium">Tỷ lệ hoàn thành</p>
          <p className="text-3xl font-bold text-orange-900 mt-2">
            {((statistics.eaten / statistics.totalRestaurants) * 100).toFixed(0)}%
          </p>
          <p className="text-orange-600 text-xs mt-2">
            {statistics.eaten}/{statistics.totalRestaurants} quán
          </p>
        </div>
      </div>
    </div>
  );
}
