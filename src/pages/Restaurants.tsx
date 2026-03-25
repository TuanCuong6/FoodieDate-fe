import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Heart,
  Check,
  ThumbsDown,
  Clock,
  Filter,
  Search,
  ExternalLink,
  Trash2,
  Calendar,
  X,
  Plus,
} from 'lucide-react';
import { RestaurantStatus, CreatePlanDto } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRestaurants, deleteRestaurant, setFilters } from '../store/slices/restaurantsSlice';
import { fetchAreas } from '../store/slices/areasSlice';
import { createPlan } from '../store/slices/plansSlice';

interface SelectedRestaurant {
  id: number;
  name: string;
  address?: string;
  phone?: string;
}

export default function Restaurants() {
  const navigate = useNavigate();
  const { coupleId } = useAuth();
  const { showToast } = useUI();
  const dispatch = useAppDispatch();
  
  const { restaurants, loading, filters } = useAppSelector((state) => state.restaurants);
  const { areas } = useAppSelector((state) => state.areas);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<SelectedRestaurant | null>(null);
  const [planForm, setPlanForm] = useState({
    planDate: '',
    planTime: '',
    notes: '',
  });

  const statusConfig = {
    [RestaurantStatus.MuonAn]: {
      label: 'Muốn ăn',
      icon: Heart,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
    [RestaurantStatus.DaAn]: {
      label: 'Đã ăn',
      icon: Check,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    [RestaurantStatus.KhongThich]: {
      label: 'Không thích',
      icon: ThumbsDown,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    [RestaurantStatus.CanNhac]: {
      label: 'Cân nhắc',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  };

  useEffect(() => {
    if (coupleId) {
      dispatch(fetchRestaurants({ coupleId, areaId: filters.areaId, status: filters.status }));
      dispatch(fetchAreas(coupleId));
    }
  }, [coupleId, filters.areaId, filters.status, dispatch]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa quán "${name}"?`)) return;

    try {
      await dispatch(deleteRestaurant(id)).unwrap();
      showToast('success', 'Xóa quán thành công');
    } catch (error: any) {
      showToast('error', error.message || 'Không thể xóa quán');
    }
  };

  const handleAreaChange = (areaId: number | undefined) => {
    dispatch(setFilters({ areaId, status: filters.status }));
  };

  const handleStatusChange = (status: RestaurantStatus | undefined) => {
    dispatch(setFilters({ areaId: filters.areaId, status }));
  };

  const handleOpenPlanModal = (restaurant: SelectedRestaurant) => {
    setSelectedRestaurant(restaurant);
    setShowPlanModal(true);
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPlanForm({
      planDate: tomorrow.toISOString().split('T')[0],
      planTime: '19:00',
      notes: '',
    });
  };

  const handleCreatePlan = async () => {
    if (!coupleId || !selectedRestaurant) return;

    if (!planForm.planDate) {
      showToast('error', 'Vui lòng chọn ngày hẹn');
      return;
    }

    try {
      const dto: CreatePlanDto = {
        coupleId,
        restaurantId: selectedRestaurant.id,
        planDate: new Date(planForm.planDate).toISOString(),
        planTime: planForm.planTime || undefined,
        notes: planForm.notes || undefined,
      };

      await dispatch(createPlan(dto)).unwrap();
      showToast('success', 'Tạo lịch hẹn thành công!');
      setShowPlanModal(false);
      setSelectedRestaurant(null);
      setPlanForm({ planDate: '', planTime: '', notes: '' });
    } catch (error: any) {
      showToast('error', error.message || 'Không thể tạo lịch hẹn');
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Danh sách quán ăn</h1>
          <p className="text-gray-600 mt-1">
            {filteredRestaurants.length} quán trong danh sách
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/restaurants/add')}
            className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm quán ăn</span>
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all"
          >
            <Filter className="w-5 h-5" />
            <span>Bộ lọc</span>
          </button>
        </div>
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
                value={filters.areaId || ''}
                onChange={(e) => handleAreaChange(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">Tất cả khu vực</option>
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
                value={filters.status !== undefined ? filters.status : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  handleStatusChange(value === '' ? undefined : parseInt(value) as RestaurantStatus);
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">Tất cả trạng thái</option>
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
            Chưa có quán nào
          </h3>
          <p className="text-gray-600">
            Thêm quán ăn đầu tiên của bạn
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
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-lg flex-1">
                      {restaurant.name}
                    </h3>
                    <div className={`${config.bgColor} px-2 py-1 rounded-full flex items-center space-x-1`}>
                      <StatusIcon className={`w-4 h-4 ${config.color}`} />
                      <span className={`text-xs font-semibold ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start space-x-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{restaurant.address || 'Chưa có địa chỉ'}</span>
                    </div>

                    {restaurant.phone && (
                      <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{restaurant.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.areaName}</span>
                    </div>
                  </div>

                  {restaurant.notes && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {restaurant.notes}
                    </p>
                  )}

                  {restaurant.source && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
                      <span>Từ {restaurant.source}</span>
                      {restaurant.sourceUrl && (
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleOpenPlanModal({
                        id: restaurant.id,
                        name: restaurant.name,
                        address: restaurant.address,
                        phone: restaurant.phone,
                      })}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:shadow-lg rounded-lg transition"
                    >
                      <Calendar size={16} />
                      <span className="text-sm">Tạo lịch hẹn</span>
                    </button>
                    <button
                      onClick={() => handleDelete(restaurant.id, restaurant.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Xóa quán"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Plan Modal */}
      {showPlanModal && selectedRestaurant && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPlanModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Tạo lịch hẹn</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedRestaurant.name}</p>
              </div>
              <button
                onClick={() => setShowPlanModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedRestaurant.address && (
                <div className="flex items-start space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{selectedRestaurant.address}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày hẹn *
                </label>
                <input
                  type="date"
                  value={planForm.planDate}
                  onChange={(e) => setPlanForm({ ...planForm, planDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giờ hẹn
                </label>
                <input
                  type="time"
                  value={planForm.planTime}
                  onChange={(e) => setPlanForm({ ...planForm, planTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={planForm.notes}
                  onChange={(e) => setPlanForm({ ...planForm, notes: e.target.value })}
                  rows={3}
                  placeholder="Đặt bàn, gọi món trước, mang theo gì..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t">
                <button
                  onClick={handleCreatePlan}
                  disabled={!planForm.planDate}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tạo lịch hẹn
                </button>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
