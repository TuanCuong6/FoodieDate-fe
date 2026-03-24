import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { CreateAreaDto, UpdateAreaDto, AreaDto } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAreas, createArea, updateArea, deleteArea } from '../store/slices/areasSlice';

export default function Areas() {
  const { coupleId } = useAuth();
  const { showToast } = useUI();
  const dispatch = useAppDispatch();
  
  const { areas, loading } = useAppSelector((state) => state.areas);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArea, setEditingArea] = useState<AreaDto | null>(null);
  const [newAreaName, setNewAreaName] = useState('');
  const [editAreaName, setEditAreaName] = useState('');

  useEffect(() => {
    if (coupleId) {
      dispatch(fetchAreas(coupleId));
    }
  }, [coupleId, dispatch]);

  const handleAddArea = async () => {
    if (!newAreaName.trim() || !coupleId) return;

    try {
      const dto: CreateAreaDto = {
        coupleId,
        name: newAreaName.trim(),
      };

      await dispatch(createArea(dto)).unwrap();
      setNewAreaName('');
      setShowAddModal(false);
      showToast('success', 'Thêm khu vực thành công');
    } catch (error: any) {
      showToast('error', error.message || 'Không thể thêm khu vực');
    }
  };

  const handleUpdateArea = async () => {
    if (!editingArea || !editAreaName.trim()) return;

    try {
      const dto: UpdateAreaDto = {
        name: editAreaName.trim(),
      };

      await dispatch(updateArea({ id: editingArea.id, dto })).unwrap();
      setEditingArea(null);
      setEditAreaName('');
      showToast('success', 'Cập nhật khu vực thành công');
    } catch (error: any) {
      showToast('error', error.message || 'Không thể cập nhật khu vực');
    }
  };

  const handleDeleteArea = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa khu vực "${name}"?`)) return;

    try {
      await dispatch(deleteArea(id)).unwrap();
      showToast('success', 'Xóa khu vực thành công');
    } catch (error: any) {
      showToast('error', error.message || 'Không thể xóa khu vực');
    }
  };

  const startEdit = (area: AreaDto) => {
    setEditingArea(area);
    setEditAreaName(area.name);
  };

  const cancelEdit = () => {
    setEditingArea(null);
    setEditAreaName('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <MapPin className="text-orange-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý khu vực</h1>
              <p className="text-sm text-gray-600">Tổ chức quán ăn theo khu vực</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            <Plus size={20} />
            Thêm khu vực
          </button>
        </div>

        {areas.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-600 mb-4">Chưa có khu vực nào</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-orange-500 hover:text-orange-600 font-semibold"
            >
              Thêm khu vực đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {areas.map((area) => (
              <div
                key={area.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition"
              >
                {editingArea?.id === area.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editAreaName}
                      onChange={(e) => setEditAreaName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      autoFocus
                      onKeyPress={(e) => e.key === 'Enter' && handleUpdateArea()}
                    />
                    <button
                      onClick={handleUpdateArea}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Lưu"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Hủy"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <MapPin className="text-orange-500" size={20} />
                      <div>
                        <h3 className="font-semibold text-gray-800">{area.name}</h3>
                        <p className="text-xs text-gray-500">
                          Tạo: {new Date(area.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(area)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteArea(area.id, area.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Thêm khu vực mới</h3>
            <input
              type="text"
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
              placeholder="Tên khu vực (VD: Đống Đa, Cầu Giấy...)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 mb-4"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleAddArea()}
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddArea}
                disabled={!newAreaName.trim()}
                className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              >
                Thêm
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewAreaName('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
