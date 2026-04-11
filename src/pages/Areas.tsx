import { useState, useEffect } from "react";
import { MapPin, Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { CreateAreaDto, UpdateAreaDto, AreaDto } from "../services";
import { useAuth } from "../contexts/AuthContext";
import { useUI } from "../contexts/UIContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchAreas,
  createArea,
  updateArea,
  deleteArea,
} from "../store/slices/areasSlice";
import RequireCouple from "../components/common/RequireCouple";
import { getAreaPresentation } from "../data/seedAreas";

export default function Areas() {
  const { coupleId } = useAuth();
  const { showToast } = useUI();
  const dispatch = useAppDispatch();

  const { areas } = useAppSelector((state) => state.areas);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArea, setEditingArea] = useState<AreaDto | null>(null);
  const [newAreaName, setNewAreaName] = useState("");
  const [editAreaName, setEditAreaName] = useState("");

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
      setNewAreaName("");
      setShowAddModal(false);
      showToast("success", "Thêm khu vực thành công");
    } catch (error: any) {
      showToast("error", error.message || "Không thể thêm khu vực");
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
      setEditAreaName("");
      showToast("success", "Cập nhật khu vực thành công");
    } catch (error: any) {
      showToast("error", error.message || "Không thể cập nhật khu vực");
    }
  };

  const handleDeleteArea = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa khu vực "${name}"?`)) return;

    try {
      await dispatch(deleteArea(id)).unwrap();
      showToast("success", "Xóa khu vực thành công");
    } catch (error: any) {
      showToast("error", error.message || "Không thể xóa khu vực");
    }
  };

  const startEdit = (area: AreaDto) => {
    setEditingArea(area);
    setEditAreaName(area.name);
  };

  const cancelEdit = () => {
    setEditingArea(null);
    setEditAreaName("");
  };

  return (
    <RequireCouple>
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-white to-rose-50 shadow-lg border border-orange-100">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-rose-200/40 blur-3xl" />

          <div className="relative p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-orange-100">
                  <MapPin className="text-orange-600" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Khu vực hẹn hò
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Chọn một khu vực, rồi lưu những quán “đáng thử” cho buổi hẹn
                    tiếp theo.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition shadow-sm"
              >
                <Plus size={20} />
                Thêm khu vực
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/70 border border-orange-100 text-gray-700">
                Gợi ý: tạo 5-7 khu vực bạn hay đi
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/70 border border-orange-100 text-gray-700">
                Lưu quán theo vibe: lãng mạn, chill, ăn no nê
              </span>
            </div>
          </div>
        </div>

        {areas.length === 0 ? (
          <div className="mt-6 bg-white rounded-3xl shadow-lg border border-gray-100 p-10 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
              <MapPin className="text-orange-500" size={30} />
            </div>
            <p className="text-gray-900 font-semibold">Chưa có khu vực nào</p>
            <p className="text-gray-600 text-sm mt-1 mb-6">
              Tạo vài khu vực quen thuộc để việc lưu quán ăn gọn gàng hơn.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition shadow-sm"
            >
              <Plus size={18} />
              Thêm khu vực đầu tiên
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {areas.map((area) => {
              const presentation = getAreaPresentation(area.name);

              return (
                <div
                  key={area.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition"
                >
                  <div className="relative h-36">
                    <img
                      src={presentation.coverUrl}
                      alt={area.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      {editingArea?.id === area.id ? (
                        <>
                          <button
                            onClick={handleUpdateArea}
                            className="p-2 bg-white/95 text-green-700 hover:bg-white rounded-xl transition"
                            title="Lưu"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 bg-white/95 text-gray-700 hover:bg-white rounded-xl transition"
                            title="Hủy"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(area)}
                            className="p-2 bg-white/95 text-blue-700 hover:bg-white rounded-xl transition"
                            title="Sửa"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteArea(area.id, area.name)}
                            className="p-2 bg-white/95 text-red-700 hover:bg-white rounded-xl transition"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="text-orange-300" size={18} />

                        {editingArea?.id === area.id ? (
                          <input
                            type="text"
                            value={editAreaName}
                            onChange={(e) => setEditAreaName(e.target.value)}
                            className="w-full bg-white/95 px-3 py-1.5 rounded-xl border border-white/70 focus:ring-2 focus:ring-orange-500"
                            autoFocus
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleUpdateArea()
                            }
                          />
                        ) : (
                          <h3 className="text-white text-lg font-bold leading-tight">
                            {area.name}
                          </h3>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {presentation.subtitle}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {presentation.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                      Tạo:{" "}
                      {new Date(area.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
              );
            })}
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
              onKeyPress={(e) => e.key === "Enter" && handleAddArea()}
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
                  setNewAreaName("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </RequireCouple>
  );
}
