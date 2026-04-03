import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  FileText,
  Check,
  Sparkles,
} from 'lucide-react';
import { CreateRestaurantDto, RestaurantStatus } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createRestaurant } from '../store/slices/restaurantsSlice';
import { fetchAreas } from '../store/slices/areasSlice';
import RequireCouple from '../components/common/RequireCouple';

export default function AddRestaurant() {
  const navigate = useNavigate();
  const { coupleId, userId } = useAuth();
  const { showToast, setGlobalLoading } = useUI();
  const dispatch = useAppDispatch();
  
  const { areas } = useAppSelector((state) => state.areas);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    areaId: 0,
    notes: '',
    source: '',
    sourceUrl: '',
    status: RestaurantStatus.MuonAn,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (coupleId) {
      dispatch(fetchAreas(coupleId));
    }
  }, [coupleId, dispatch]);

  useEffect(() => {
    if (areas.length > 0 && formData.areaId === 0) {
      setFormData(prev => ({ ...prev, areaId: areas[0].id }));
    }
  }, [areas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupleId) return;
    
    setIsSubmitting(true);
    setGlobalLoading(true);

    try {
      const dto: CreateRestaurantDto = {
        coupleId,
        areaId: formData.areaId,
        name: formData.name,
        address: formData.address || undefined,
        phone: formData.phone || undefined,
        source: formData.source || undefined,
        sourceUrl: formData.sourceUrl || undefined,
        notes: formData.notes || undefined,
        status: formData.status,
        createdBy: userId!,
      };

      await dispatch(createRestaurant(dto)).unwrap();
      setShowSuccess(true);
      showToast('success', 'Thêm quán thành công');
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/restaurants');
      }, 1500);
    } catch (error: any) {
      showToast('error', error.message || 'Không thể thêm quán');
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
      [name]: name === 'areaId' ? parseInt(value) : 
              name === 'status' ? parseInt(value) : value,
    });
  };

  const parseFromUrl = () => {
    const sampleData = {
      name: 'Phở Lý Quốc Sư',
      address: '10 Lý Quốc Sư, Hoàn Kiếm, Hà Nội',
      phone: '0243 926 8989',
      notes: 'Phở bò truyền thống ngon, nước dùng đậm đà, thịt mềm',
      source: 'TikTok',
    };

    setFormData({ ...formData, ...sampleData });
  };

  if (areas.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-yellow-900 mb-2">
            Chưa có khu vực nào
          </h3>
          <p className="text-yellow-800 mb-4">
            Bạn cần tạo ít nhất một khu vực trước khi thêm quán ăn
          </p>
          <button
            onClick={() => navigate('/areas')}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Đi tới Quản lý khu vực
          </button>
        </div>
      </div>
    );
  }

  return (
    <RequireCouple>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
        <h1 className="text-3xl font-bold text-gray-900">Thêm quán mới</h1>
        <p className="text-gray-600 mt-1">
          Thêm quán ăn yêu thích vào danh sách của bạn
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">
                Thêm nhanh từ link
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                Dán link từ TikTok, Facebook, Instagram để tự động điền thông tin
              </p>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="sourceUrl"
                  value={formData.sourceUrl}
                  onChange={handleChange}
                  placeholder="https://tiktok.com/@foodie/video/..."
                  className="flex-1 border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={parseFromUrl}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Phân tích
                </button>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên quán *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="VD: Phở Thìn Bờ Hồ"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Khu vực *
              </label>
              <select
                name="areaId"
                value={formData.areaId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Địa chỉ
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="VD: 13 Lò Đúc, Hai Bà Trưng, Hà Nội"
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số điện thoại
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="VD: 024 3942 8855"
                  className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value={RestaurantStatus.MuonAn}>Muốn ăn</option>
                <option value={RestaurantStatus.DaAn}>Đã ăn</option>
                <option value={RestaurantStatus.CanNhac}>Cân nhắc</option>
                <option value={RestaurantStatus.KhongThich}>Không thích</option>
              </select>
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
                placeholder="Mô tả quán ăn, món ngon, điểm đặc biệt..."
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nguồn
            </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="">Chọn nguồn</option>
              <option value="TikTok">TikTok</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang thêm...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Thêm quán</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/restaurants')}
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
            <p className="text-gray-600">
              Quán ăn đã được thêm vào danh sách
            </p>
          </div>
        </div>
      )}
      </div>
    </RequireCouple>
  );
}
