import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  FileText,
  Check,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { CreatePlanDto } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createPlan } from '../store/slices/plansSlice';
import { fetchRestaurants } from '../store/slices/restaurantsSlice';
import { randomRestaurant } from '../store/slices/plansSlice';

export default function AddPlan() {
  const navigate = useNavigate();
  const { coupleId } = useAuth();
  const { showToast, setGlobalLoading } = useUI();
  const dispatch = useAppDispatch();
  
  const { restaurants } = useAppSelector((state) => state.restaurants);
  
  const [formData, setFormData] = useState({
    restaurantId: 0,
    planDate: '',
    planTime: '19:00',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (coupleId) {
      // Load all restaurants (no filter)
      dispatch(fetchRestaurants({ coupleId }));
    }
  }, [coupleId, dispatch]);

  useEffect(() => {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData(prev => ({ 
      ...prev, 
      planDate: tomorrow.toISOString().split('T')[0] 
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupleId) return;
    
    if (!formData.restaurantId) {
      showToast('error', 'Vui lòng chọn quán ăn');
      return;
    }

    if (!formData.planDate) {
      showToast('error', 'Vui lòng chọn ngày hẹn');
      return;
    }
    
    setIsSubmitting(true);
    setGlobalLoading(true);

    try {
      const dto: CreatePlanDto = {
        coupleId,
        restaurantId: formData.restaurantId,
        planDate: new Date(formData.planDate).toISOString(),
        planTime: formData.planTime || undefined,
        notes: formData.notes || undefined,
      };

      await dispatch(createPlan(dto)).unwrap();
      setShowSuccess(true);
      showToast('success', 'Tạo lịch hẹn thành công');
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/calendar');
      }, 1500);
    } catch (error: any) {
      showToast('error', error.message || 'Không thể tạo lịch hẹn');
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
      [name]: name === 'restaurantId' ? parseInt(value) : value,
    });
  };

  const handleRandomRestaurant = async () => {
    if (!coupleId) return;

    try {
      const restaurantId = await dispatch(randomRestaurant(coupleId)).unwrap();
      setFormData({ ...formData, restaurantId });
      showToast('success', 'Đã chọn quán ngẫu nhiên!');
    } catch (error: any) {
      showToast('error', error.message || 'Không có quán nào trong danh sách "Muốn ăn"');
    }
  };

  const selectedRestaurant = restaurants.find(r => r.id === formData.restaurantId);

  if (restaurants.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-yellow-900 mb-2">
            Chưa có quán ăn nào
          </h3>
          <p className="text-yellow-800 mb-4">
            Bạn cần thêm ít nhất một quán ăn trước khi tạo lịch hẹn
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tạo lịch hẹn mới</h1>
        <p className="text-gray-600 mt-1">
          Lên kế hoạch cho buổi hẹn ăn uống của bạn
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 mb-2">
                Không biết chọn quán nào?
              </h3>
              <p className="text-sm text-purple-800 mb-3">
                Để chúng tôi chọn ngẫu nhiên một quán từ danh sách "Muốn ăn" của bạn
              </p>
              <button
                type="button"
                onClick={handleRandomRestaurant}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                🎲 Random quán
              </button>
            </div>
          </div>
        </div>

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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                {selectedRestaurant.phone && (
                  <p>📞 {selectedRestaurant.phone}</p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ngày hẹn *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="planDate"
                  value={formData.planDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Giờ hẹn
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="time"
                  name="planTime"
                  value={formData.planTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
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
                rows={4}
                placeholder="Đặt bàn trước, gọi món gì, mang theo gì..."
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Tạo lịch hẹn</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/calendar')}
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
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thành công!
            </h3>
            <p className="text-gray-600">
              Lịch hẹn đã được tạo
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
