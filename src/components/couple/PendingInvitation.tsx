import { useState } from 'react';
import { Heart, Check, X, Mail } from 'lucide-react';
import { CoupleDetail, coupleService } from '../../services/coupleService';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';

interface PendingInvitationProps {
  invitation: CoupleDetail;
  onAccepted: () => void;
  onRejected: () => void;
}

export default function PendingInvitation({ invitation, onAccepted, onRejected }: PendingInvitationProps) {
  const { userId } = useAuth();
  const { showToast } = useUI();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    if (!userId) return;
    
    setIsProcessing(true);
    try {
      const response = await coupleService.acceptInvitation(invitation.id, userId);
      if (response.success) {
        showToast('success', response.data?.message || 'Đã chấp nhận lời mời');
        onAccepted();
      } else {
        showToast('error', response.message || 'Không thể chấp nhận lời mời');
      }
    } catch (error: any) {
      showToast('error', error.message || 'Đã có lỗi xảy ra');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!userId) return;
    
    if (!confirm('Bạn có chắc muốn từ chối lời mời này?')) return;
    
    setIsProcessing(true);
    try {
      const response = await coupleService.rejectInvitation(invitation.id, userId);
      if (response.success) {
        showToast('success', response.data?.message || 'Đã từ chối lời mời');
        onRejected();
      } else {
        showToast('error', response.message || 'Không thể từ chối lời mời');
      }
    } catch (error: any) {
      showToast('error', error.message || 'Đã có lỗi xảy ra');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-6 border-2 border-rose-300 shadow-lg">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-rose-900 mb-2 flex items-center space-x-2">
            <Heart className="w-5 h-5" />
            <span>Lời mời kết nối cặp đôi</span>
          </h3>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">{invitation.user1.name}</span> ({invitation.user1.email}) đã gửi lời mời kết nối với bạn
            </p>
            {invitation.coupleName && (
              <p className="text-gray-600 text-sm">
                Tên cặp đôi: <span className="font-semibold">{invitation.coupleName}</span>
              </p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              Gửi lúc: {new Date(invitation.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleAccept}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Check className="w-5 h-5" />
              <span>Chấp nhận</span>
            </button>
            
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>Từ chối</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
