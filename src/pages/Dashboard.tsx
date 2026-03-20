import {
  Heart,
  Calendar,
  MapPin,
  TrendingUp,
  Clock,
  Star,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { statistics, plans, restaurants, reviews } from '../data/mockData';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const upcomingPlans = plans.filter((p) => p.status === 'upcoming');
  const recentRestaurants = restaurants.slice(0, 4);
  const recentReviews = reviews.slice(0, 3);

  const stats = [
    {
      label: 'Tổng quán',
      value: statistics.totalRestaurants,
      icon: MapPin,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Muốn thử',
      value: statistics.wantToEat,
      icon: Heart,
      color: 'from-rose-500 to-pink-500',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
    },
    {
      label: 'Đã ăn',
      value: statistics.eaten,
      icon: Star,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      label: 'Lịch hẹn',
      value: statistics.upcomingPlans,
      icon: Calendar,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Xin chào! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Hôm nay đi ăn gì nhé? ❤️
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <div
                className={`h-2 bg-gradient-to-r ${stat.color} rounded-full mt-4`}
              />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-rose-500" />
              <span>Lịch hẹn sắp tới</span>
            </h2>
            <button
              onClick={() => onNavigate('calendar')}
              className="text-rose-600 hover:text-rose-700 font-medium text-sm flex items-center space-x-1"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {upcomingPlans.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Chưa có lịch hẹn nào</p>
              <button
                onClick={() => onNavigate('restaurants')}
                className="mt-4 text-rose-600 hover:text-rose-700 font-medium"
              >
                Thêm lịch hẹn ngay
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all border border-gray-100"
                >
                  <img
                    src={plan.restaurant.images[0]}
                    alt={plan.restaurant.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">
                      {plan.restaurant.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {plan.restaurant.address}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-rose-600 font-medium flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(plan.date).toLocaleDateString('vi-VN')}</span>
                      </span>
                      <span className="text-sm text-gray-600 flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{plan.time}</span>
                      </span>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                    Chi tiết
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            <span>Thống kê</span>
          </h2>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Tổng chi tiêu</span>
                <span className="text-2xl font-bold text-emerald-600">
                  {(statistics.totalSpent / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="bg-emerald-100 h-2 rounded-full">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full w-3/4" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Đánh giá TB</span>
                <span className="text-2xl font-bold text-amber-600 flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-current" />
                  <span>{statistics.averageRating.toFixed(1)}</span>
                </span>
              </div>
              <div className="bg-amber-100 h-2 rounded-full">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                  style={{ width: `${(statistics.averageRating / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Reviews gần đây
              </h3>
              <div className="space-y-3">
                {recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? 'text-amber-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {review.restaurant.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.visitDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Heart className="w-6 h-6 text-rose-500" />
            <span>Muốn thử</span>
          </h2>
          <button
            onClick={() => onNavigate('restaurants')}
            className="text-rose-600 hover:text-rose-700 font-medium text-sm flex items-center space-x-1"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="group cursor-pointer"
              onClick={() => onNavigate('restaurants')}
            >
              <div className="relative overflow-hidden rounded-xl mb-3">
                <img
                  src={restaurant.images[0]}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {restaurant.status === 'want_to_eat' ? '❤️ Muốn ăn' : '✨ Đã ăn'}
                </div>
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                {restaurant.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                {restaurant.address}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium text-rose-600">
                  {restaurant.priceRange}
                </span>
                {restaurant.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">
                      {restaurant.rating}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
