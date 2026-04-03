import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Star,
  FileText,
  Check,
  MapPin,
  Image as ImageIcon,
} from 'lucide-react';
import { CreateVisitHistoryDto } from '../services/visitHistoryService';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createVisitHistory } from '../store/slices/visitHistoriesSlice';
import { fetchRestaurants } from '../store/slices/restaurantsSlice';
import RequireCouple from '../components/common/RequireCouple';

export default function AddHistory() {
  const navigate = useNavigate();
  const { coupleId } = useAuth();
  const { showToast, setGlobalLoading } = useUI();
  const dispatch = useAppDispatch();

  const { restaurants } = useAppSelector((state) => state.restaurants);

  const [formData, setFormData] = useState({
    restaurantId: 0,
    visitDate: '',
    rating: 0,
    review: '',
    notes: '',
    photoUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (coupleId) {
      dispatch(fetchRestaurants({ coupleId }));
    }
  }, [coupleId, dispatch]);

  useEffect(() => {
    const today = new Date();
    setFormData((prev) => ({
      ...prev,
      visitDate: today.toISOString().split('T')[0],
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupleId) return;

    if (!formData.restaurantId) {
      showToast('error', 'Vui lòng chọn quán ăn');
      return;
    }

    if (!formData.visitDate) {
      showToast('error', 'Vui lòng chọn ngày đã ăn');
      return;
    }

    setIsSubmitting(true);
    setGlobalLoading(true);

    try {
      const dto: CreateVisitHistoryDto = {
        coupleId,
        restaurantId: formData.restaurantId,
        visitDate: new Date(formData.visitDate).toISOString(),
        rating: formData.rating > 0 ? formData.rating : undefined,
        review: formData.review || undefined,
        notes: formData.notes || undefined,
        photoUrl: formData.photoUrl || undefined,
      };

      await dispatch(createVisitHistory(dto)).unwrap();
      setShowSuccess(true);
      showToast('success', 'Thêm lịch sử thành công');
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/history');
      }, 1500);
    } catch (error: any) {
      showToast('error', error.message || 'Không thể thêm lịch sử');
    } finally {
      setIsSubmitting(false);
      setGlobalLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'restaurantId' || name === 'rating' ? parseInt(value) : value,
    });
  };

  const selectedRestaurant = restaurants.find((r) => r.id === formData.restaurantId);

  if (restaurants.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-yellow-900 mb-2">
            Chưa có quán ăn nào
          </h3>
          <p className="text-yellow-800 mb-4">
            Bạn cần thêm ít nhất một quán ăn trước khi thêm lịch sử
          </p>
          <button
            onClick={() => navigate('/restaurants/add')}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Đi tới Thêm quán ăn
          </button>
        </div>
      </div>
    );
  }

  return (
    <RequireCouple>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
        <h1 className="text-3xl font-bold text-gray-900">Thêm lịch sử đã ăn</h1>
        <p className="text-gray-600 mt-1">
          Ghi lại trải nghiệm ăn uống của bạn
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Chọn quán ăn *
            </label>
            <select
              name="restaurantId"
              value={formData.restaurantId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- Chọn quán ăn --</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name} - {restaurant.areaName}
                </option>
              ))}
            </select>
          </div>

          {selectedRestaurant && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Thông tin quán</h4>
              <div className="space-y-1 text-sm text-gray-600">
                {selectedRestaurant.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{selectedRestaurant.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ngày đã ăn *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="date"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Đánh giá
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= formData.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
              {formData.rating > 0 && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: 0 })}
                  className="ml-4 text-sm text-gray-500 hover:text-gray-700"
                >
                  Xóa đánh giá
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Đánh giá chi tiết
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <textarea
                name="review"
                value={formData.review}
                onChange={handleChange}
                rows={4}
                placeholder="Món ăn thế nào? Không gian ra sao? Bạn có muốn quay lại không?"
                maxLength={1000}
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formData.review.length}/1000 ký tự
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ghi chú
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Ghi chú thêm..."
                maxLength={500}
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Link ảnh
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="url"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                maxLength={500}
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {formData.photoUrl && (
              <div className="mt-3">
                <img
                  src={formData.photoUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Lưu lịch sử</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/history')}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thành công!
            </h3>
            <p className="text-gray-600">Lịch sử đã được lưu</p>
          </div>
        </div>
      )}
      </div>
    </RequireCouple>
  );
}
