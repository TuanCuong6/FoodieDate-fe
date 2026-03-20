import { useState } from 'react';
import { X, MapPin, Phone, Star, Calendar, Heart, Check, ThumbsDown, Clock, ExternalLink, Share2, CreditCard as Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onClose: () => void;
}

export default function RestaurantDetail({
  restaurant,
  onClose,
}: RestaurantDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const statusConfig = {
    want_to_eat: {
      label: 'Muốn ăn',
      icon: Heart,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
    eaten: {
      label: 'Đã ăn',
      icon: Check,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    dislike: {
      label: 'Không thích',
      icon: ThumbsDown,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    considering: {
      label: 'Cân nhắc',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  };

  const config = statusConfig[restaurant.status];
  const StatusIcon = config.icon;

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === restaurant.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? restaurant.images.length - 1 : prev - 1
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết quán ăn</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative">
          <img
            src={restaurant.images[currentImageIndex]}
            alt={restaurant.name}
            className="w-full h-96 object-cover"
          />

          {restaurant.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {restaurant.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-white w-8'
                        : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute top-4 right-4 flex space-x-2">
            <div
              className={`${config.bgColor} px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg`}
            >
              <StatusIcon className={`w-5 h-5 ${config.color}`} />
              <span className={`font-semibold ${config.color}`}>
                {config.label}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {restaurant.name}
                </h3>
                <div className="flex items-center space-x-4">
                  {restaurant.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-amber-400 fill-current" />
                      <span className="font-bold text-gray-900">
                        {restaurant.rating}
                      </span>
                    </div>
                  )}
                  <span className="text-lg font-semibold text-rose-600">
                    {restaurant.priceRange || 'Chưa rõ giá'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-gray-600">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{restaurant.address}</span>
              </div>

              {restaurant.phone && (
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="hover:text-rose-600 transition-colors"
                  >
                    {restaurant.phone}
                  </a>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  📍 {restaurant.area.name}
                </span>
                {restaurant.source && (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    📱 Từ {restaurant.source}
                  </span>
                )}
              </div>
            </div>
          </div>

          {restaurant.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="font-semibold text-amber-900 mb-2">Ghi chú</h4>
              <p className="text-amber-800 leading-relaxed">{restaurant.notes}</p>
            </div>
          )}

          {restaurant.tags && restaurant.tags.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Thẻ tag</h4>
              <div className="flex flex-wrap gap-2">
                {restaurant.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {restaurant.visitedAt && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-emerald-700">
                <Check className="w-5 h-5" />
                <span className="font-semibold">
                  Đã ăn vào{' '}
                  {new Date(restaurant.visitedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          )}

          {restaurant.sourceUrl && (
            <a
              href={restaurant.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="font-medium">Xem nguồn gốc</span>
            </a>
          )}

          <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
            <button className="flex-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Tạo lịch hẹn</span>
            </button>

            <button className="flex-1 bg-emerald-50 text-emerald-700 py-3 rounded-lg font-semibold hover:bg-emerald-100 transition-all">
              Đổi trạng thái
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500 pt-4 border-t border-gray-200">
            <Clock className="w-4 h-4" />
            <span>
              Đã thêm vào{' '}
              {new Date(restaurant.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
