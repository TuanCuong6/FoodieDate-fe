import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History as HistoryIcon,
  Star,
  MapPin,
  Calendar,
  Trash2,
  Edit,
  Plus,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchVisitHistoriesByCoupleId,
  deleteVisitHistory,
} from '../store/slices/visitHistoriesSlice';
import { VisitHistoryDto } from '../services/visitHistoryService';

export default function History() {
  const navigate = useNavigate();
  const { coupleId } = useAuth();
  const { showToast } = useUI();
  const dispatch = useAppDispatch();

  const { visitHistories, loading } = useAppSelector((state) => state.visitHistories || { visitHistories: [], loading: false });

  const [selectedVisit, setSelectedVisit] = useState<VisitHistoryDto | null>(null);

  useEffect(() => {
    if (coupleId) {
      dispatch(fetchVisitHistoriesByCoupleId(coupleId));
    }
  }, [coupleId, dispatch]);

  const handleDelete = async (id: number, restaurantName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa lịch sử "${restaurantName}"?`)) return;

    try {
      await dispatch(deleteVisitHistory(id)).unwrap();
      showToast('success', 'Xóa lịch sử thành công');
      setSelectedVisit(null);
    } catch (error: any) {
      showToast('error', error.message || 'Không thể xóa lịch sử');
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
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch sử đã ăn</h1>
          <p className="text-gray-600 mt-1">
            {visitHistories.length} lần đã ghé thăm
          </p>
        </div>
        <button
          onClick={() => navigate('/history/add')}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm lịch sử</span>
        </button>
      </div>

      {visitHistories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Chưa có lịch sử nào
          </h3>
          <p className="text-gray-600 mb-4">
            Thêm lịch sử đầu tiên của bạn
          </p>
          <button
            onClick={() => navigate('/history/add')}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Thêm lịch sử
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visitHistories.map((visit) => (
            <div
              key={visit.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden cursor-pointer"
              onClick={() => setSelectedVisit(visit)}
            >
              {visit.photoUrl && (
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={visit.photoUrl}
                    alt={visit.restaurantName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg flex-1">
                    {visit.restaurantName}
                  </h3>
                  {visit.rating && renderStars(visit.rating)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {new Date(visit.visitDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{visit.areaName}</span>
                  </div>
                </div>

                {visit.review && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {visit.review}
                  </p>
                )}

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/history/edit/${visit.id}`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                  >
                    <Edit size={16} />
                    <span className="text-sm">Sửa</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(visit.id, visit.restaurantName);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedVisit && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVisit(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedVisit.photoUrl && (
              <div className="mb-4 rounded-xl overflow-hidden">
                <img
                  src={selectedVisit.photoUrl}
                  alt={selectedVisit.restaurantName}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedVisit.restaurantName}
                </h2>
                {selectedVisit.rating && (
                  <div className="flex items-center space-x-2">
                    {renderStars(selectedVisit.rating)}
                    <span className="text-sm text-gray-600">
                      {selectedVisit.rating}/5
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedVisit(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(selectedVisit.visitDate).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {selectedVisit.restaurantAddress && (
                <div className="flex items-start space-x-2 text-gray-600">
                  <MapPin className="w-5 h-5 mt-0.5" />
                  <span>{selectedVisit.restaurantAddress}</span>
                </div>
              )}

              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>Khu vực: {selectedVisit.areaName}</span>
              </div>
            </div>

            {selectedVisit.review && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-amber-900 mb-2">Đánh giá</h3>
                <p className="text-amber-800">{selectedVisit.review}</p>
              </div>
            )}

            {selectedVisit.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">Ghi chú</h3>
                <p className="text-blue-800">{selectedVisit.notes}</p>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-4 border-t">
              <button
                onClick={() => {
                  setSelectedVisit(null);
                  navigate(`/history/edit/${selectedVisit.id}`);
                }}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => handleDelete(selectedVisit.id, selectedVisit.restaurantName)}
                className="p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                title="Xóa"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
