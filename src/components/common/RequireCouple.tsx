import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface RequireCoupleProps {
  children: ReactNode;
}

export default function RequireCouple({ children }: RequireCoupleProps) {
  const navigate = useNavigate();
  const { coupleId, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <>
      {!coupleId && (
        <div className="mb-6 bg-gradient-to-r from-rose-50 to-orange-50 rounded-xl p-4 border border-rose-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-rose-900 mb-1">
                Bạn chưa có cặp đôi
              </h3>
              <p className="text-sm text-rose-800 mb-3">
                Tạo cặp đôi để bắt đầu lưu trữ và quản lý danh sách quán ăn yêu thích của hai bạn
              </p>
              <button
                onClick={() => navigate('/profile')}
                className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all inline-flex items-center space-x-2"
              >
                <Heart className="w-4 h-4" />
                <span>Tạo cặp đôi ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
