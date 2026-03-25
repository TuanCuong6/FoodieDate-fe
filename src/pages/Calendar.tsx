import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Trash2,
  Plus,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchPlansByDateRange, 
  markPlanAsCompleted, 
  markPlanAsCancelled, 
  deletePlan 
} from '../store/slices/plansSlice';
import { PlanDto } from '../services';

export default function Calendar() {
  const navigate = useNavigate();
  const { coupleId } = useAuth();
  const { showToast } = useUI();
  const dispatch = useAppDispatch();
  
  const { plans, loading } = useAppSelector((state) => state.plans);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPlan, setSelectedPlan] = useState<PlanDto | null>(null);

  useEffect(() => {
    if (coupleId) {
      // Load plans for current month
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 0).toISOString();
      
      dispatch(fetchPlansByDateRange({ coupleId, startDate, endDate }));
    }
  }, [coupleId, currentDate, dispatch]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getPlansForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return plans.filter((plan) => {
      const planDate = new Date(plan.planDate).toISOString().split('T')[0];
      return planDate === dateStr;
    });
  };

  const handleMarkCompleted = async () => {
    if (!selectedPlan) return;
    
    try {
      await dispatch(markPlanAsCompleted(selectedPlan.id)).unwrap();
      showToast('success', 'Đã đánh dấu hoàn thành');
      setSelectedPlan(null);
    } catch (error: any) {
      showToast('error', error.message || 'Không thể cập nhật');
    }
  };

  const handleCancel = async () => {
    if (!selectedPlan) return;
    
    try {
      await dispatch(markPlanAsCancelled(selectedPlan.id)).unwrap();
      showToast('success', 'Đã hủy lịch hẹn');
      setSelectedPlan(null);
    } catch (error: any) {
      showToast('error', error.message || 'Không thể hủy');
    }
  };

  const handleDelete = async () => {
    if (!selectedPlan) return;
    
    if (!confirm('Bạn có chắc muốn xóa lịch hẹn này?')) return;
    
    try {
      await dispatch(deletePlan(selectedPlan.id)).unwrap();
      showToast('success', 'Đã xóa lịch hẹn');
      setSelectedPlan(null);
    } catch (error: any) {
      showToast('error', error.message || 'Không thể xóa');
    }
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const upcomingPlans = plans.filter((p) => p.status === 'Upcoming');
  const completedPlans = plans.filter((p) => p.status === 'Completed');

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
          <h1 className="text-3xl font-bold text-gray-900">Lịch hẹn</h1>
          <p className="text-gray-600 mt-1">
            {upcomingPlans.length} lịch hẹn sắp tới
          </p>
        </div>
        <button
          onClick={() => navigate('/plans/add')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo lịch hẹn</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-gray-600 py-2"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayPlans = getPlansForDate(day);
              const hasPlans = dayPlans.length > 0;

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-2 transition-all ${
                    isToday(day)
                      ? 'border-rose-500 bg-rose-50'
                      : hasPlans
                      ? 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 cursor-pointer'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    if (hasPlans) {
                      setSelectedPlan(dayPlans[0]);
                    }
                  }}
                >
                  <div className="flex flex-col h-full">
                    <span
                      className={`text-sm font-semibold ${
                        isToday(day)
                          ? 'text-rose-600'
                          : hasPlans
                          ? 'text-emerald-600'
                          : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </span>
                    {hasPlans && (
                      <div className="mt-1 flex-1">
                        {dayPlans.map((plan) => (
                          <div
                            key={plan.id}
                            className="text-xs bg-gradient-to-r from-rose-500 to-orange-500 text-white px-1 py-0.5 rounded truncate mb-1"
                          >
                            {plan.planTime || 'Chưa rõ giờ'}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-rose-500" />
              <span>Sắp tới</span>
            </h3>
            {upcomingPlans.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                Chưa có lịch hẹn
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className="p-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center space-x-2 text-sm text-rose-600 font-medium mb-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {new Date(plan.planDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {plan.restaurantName}
                    </p>
                    {plan.planTime && (
                      <p className="text-xs text-gray-600 mt-1 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{plan.planTime}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Check className="w-5 h-5 text-emerald-500" />
              <span>Đã hoàn thành</span>
            </h3>
            {completedPlans.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                Chưa có lịch sử
              </p>
            ) : (
              <div className="space-y-3">
                {completedPlans.slice(0, 5).map((plan) => (
                  <div
                    key={plan.id}
                    className="p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-2 text-sm text-emerald-600 font-medium mb-1">
                      <Check className="w-4 h-4" />
                      <span>
                        {new Date(plan.planDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {plan.restaurantName}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedPlan && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPlan(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Chi tiết lịch hẹn
              </h2>
              <button
                onClick={() => setSelectedPlan(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedPlan.restaurantName}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <CalendarIcon className="w-5 h-5" />
                    <span>
                      {new Date(selectedPlan.planDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  {selectedPlan.planTime && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>{selectedPlan.planTime}</span>
                    </div>
                  )}
                  {selectedPlan.restaurantAddress && (
                    <div className="flex items-start space-x-2 text-gray-600">
                      <MapPin className="w-5 h-5 mt-0.5" />
                      <span>{selectedPlan.restaurantAddress}</span>
                    </div>
                  )}
                  {selectedPlan.restaurantPhone && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-5 h-5" />
                      <span>{selectedPlan.restaurantPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedPlan.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-900">
                    <span className="font-semibold">Ghi chú:</span>{' '}
                    {selectedPlan.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-3 pt-4 border-t">
                {selectedPlan.status === 'Upcoming' && (
                  <>
                    <button 
                      onClick={handleMarkCompleted}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Đã hoàn thành
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                    >
                      Hủy lịch
                    </button>
                  </>
                )}
                <button 
                  onClick={handleDelete}
                  className="p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                  title="Xóa lịch hẹn"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
