import { useState } from 'react';
import {
  MapPin,
  Phone,
  Star,
  Heart,
  Check,
  ThumbsDown,
  Clock,
  Filter,
  Search,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { restaurants, areas } from '../data/mockData';
import { Restaurant, RestaurantStatus } from '../types';

interface RestaurantsProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export default function Restaurants({ onSelectRestaurant }: RestaurantsProps) {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<RestaurantStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const statusConfig = {
    want_to_eat: {
      label: 'Muốn ăn',
      icon: Heart,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
    },
    eaten: {
      label: 'Đã ăn',
      icon: Check,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    dislike: {
      label: 'Không thích',
      icon: ThumbsDown,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
    considering: {
      label: 'Cân nhắc',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesArea = selectedArea === 'all' || restaurant.area.id === selectedArea;
    const matchesStatus = selectedStatus === 'all' || restaurant.status === selectedStatus;
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.notes?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesArea && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Danh sách quán ăn</h1>
          <p className="text-gray-600 mt-1">
            {filteredRestaurants.length} quán trong danh sách
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
        >
          <Filter className="w-5 h-5" />
          <span>Bộ lọc</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm quán ăn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-gray-700"
          />
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Khu vực
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="all">Tất cả khu vực</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as RestaurantStatus | 'all')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="all">Tất cả trạng thái</option>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Không tìm thấy quán nào
          </h3>
          <p className="text-gray-600">
            Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => {
            const config = statusConfig[restaurant.status];
            const StatusIcon = config.icon;

            return (
              <div
                key={restaurant.id}
                onClick={() => onSelectRestaurant(restaurant)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer group border border-gray-100 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={restaurant.images[0]}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <div className={`${config.bgColor} px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg`}>
                      <StatusIcon className={`w-4 h-4 ${config.color}`} />
                      <span className={`text-sm font-semibold ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                  {restaurant.rating && (
                    <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                      <Star className="w-4 h-4 text-amber-400 fill-current" />
                      <span className="text-sm font-bold text-gray-900">
                        {restaurant.rating}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-rose-600 transition-colors">
                      {restaurant.name}
                    </h3>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start space-x-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{restaurant.address}</span>
                    </div>

                    {restaurant.phone && (
                      <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{restaurant.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-rose-600">
                        {restaurant.priceRange || 'Chưa rõ'}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-600">
                        {restaurant.area.name}
                      </span>
                    </div>
                  </div>

                  {restaurant.notes && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {restaurant.notes}
                    </p>
                  )}

                  {restaurant.tags && restaurant.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {restaurant.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {restaurant.source && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Từ {restaurant.source}
                      </span>
                      {restaurant.sourceUrl && (
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
