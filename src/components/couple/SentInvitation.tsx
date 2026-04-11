import { useState } from 'react';
import { Clock, X, AlertCircle, Send } from 'lucide-react';
import { CoupleDetail, CoupleStatus, coupleService } from '../../services/coupleService';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';

interface SentInvitationProps {
  invitation: CoupleDetail;
  onCancelled: () => void;
}

export default function SentInvitation({ invitation, onCancelled }: SentInvitationProps) {
  const { userId } = useAuth();
  const { showToast } = useUI();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCancel = async () => {
    if (!userId) return;
    
    if (!confirm('Bạn có chắc muốn hủy lời mời này?')) return;
    
    setIsProcessing(true);
    try {
      const response = await coupleService.cancelInvitation(invitation.id, userId);
      if (response.success) {
        showToast('success', response.data?.message || 'Đã hủy lời mời');
        onCancelled();
      } else {
        showToast('error', response.message || 'Không thể hủy lời mời');
      }
    } catch (error: any) {
      showToast('error', error.message || 'Đã có lỗi xảy ra');
    } finally {
      setIsProcessing(false);
    }
  };

  const isRejected = invitation.status === CoupleStatus.Rejected;

  return (
    <div className={`rounded-2xl p-6 border-2 shadow-lg ${
      isRejected 
        ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300' 
        : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300'
    }`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isRejected 
              ? 'bg-gradient-to-r from-red-500 to-orange-500' 
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse'
          }`}>
            {isRejected ? (
              <AlertCircle className="w-8 h-8 text-white" />
            ) : (
              <Send className="w-8 h-8 text-white" />
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className={`text-xl font-bold mb-2 flex items-center space-x-2 ${
            isRejected ? 'text-red-900' : 'text-blue-900'
          }`}>
            <Clock className="w-5 h-5" />
            <span>{isRejected ? 'Lời mời đã bị từ chối' : 'Lời mời đang chờ xác nhận'}</span>
          </h3>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-gray-700 mb-2">
              Bạn đã gửi lời mời kết nối đến <span className="font-semibold">{invitation.user2.name}</span> ({invitation.user2.email})
            </p>
            {invitation.coupleName && (
              <p className="text-gray-600 text-sm">
                Tên cặp đôi: <span className="font-semibold">{invitation.coupleName}</span>
              </p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              Gửi lúc: {new Date(invitation.createdAt).toLocaleString('vi-VN')}
            </p>
            
            {isRejected && (
              <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-semibold">
                  ⚠️ Đối phương đã từ chối lời mời của bạn
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {isRejected && (
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Gửi lời mời mới</span>
              </button>
            )}
            
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className={`${isRejected ? 'flex-1' : 'w-full'} bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
            >
              <X className="w-5 h-5" />
              <span>{isRejected ? 'Xóa lời mời' : 'Hủy lời mời'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
