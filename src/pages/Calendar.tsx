import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';
import { plans } from '../data/mockData';
import { Plan } from '../types';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

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
    return plans.filter((plan) => plan.date === dateStr);
  };

  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
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

  const upcomingPlans = plans.filter((p) => p.status === 'upcoming');
  const completedPlans = plans.filter((p) => p.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch hẹn</h1>
          <p className="text-gray-600 mt-1">
            {upcomingPlans.length} lịch hẹn sắp tới
          </p>
        </div>
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
                            {plan.time}
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
                        {new Date(plan.date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {plan.restaurant.name}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{plan.time}</span>
                    </p>
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
                {completedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-2 text-sm text-emerald-600 font-medium mb-1">
                      <Check className="w-4 h-4" />
                      <span>
                        {new Date(plan.date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {plan.restaurant.name}
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
              <img
                src={selectedPlan.restaurant.images[0]}
                alt={selectedPlan.restaurant.name}
                className="w-full h-64 object-cover rounded-xl"
              />

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedPlan.restaurant.name}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <CalendarIcon className="w-5 h-5" />
                    <span>
                      {new Date(selectedPlan.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span>{selectedPlan.time}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-gray-600">
                    <MapPin className="w-5 h-5 mt-0.5" />
                    <span>{selectedPlan.restaurant.address}</span>
                  </div>
                  {selectedPlan.restaurant.phone && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-5 h-5" />
                      <span>{selectedPlan.restaurant.phone}</span>
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
                <button className="flex-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                  Xác nhận
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all">
                  Hủy lịch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
