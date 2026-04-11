import { useState } from "react";
import { Heart, Check, X, Mail, Clock } from "lucide-react";
import { CoupleDetail, coupleService } from "../../services/coupleService";
import { useAuth } from "../../contexts/AuthContext";
import { useUI } from "../../contexts/UIContext";

interface PendingInvitationProps {
  invitation: CoupleDetail;
  onAccepted: () => void;
  onRejected: () => void;
}

export default function PendingInvitation({
  invitation,
  onAccepted,
  onRejected,
}: PendingInvitationProps) {
  const { userId } = useAuth();
  const { showToast } = useUI();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    if (!userId) return;

    setIsProcessing(true);
    try {
      const response = await coupleService.acceptInvitation(
        invitation.id,
        userId,
      );
      if (response.success) {
        showToast("success", response.data?.message || "Đã chấp nhận lời mời");
        onAccepted();
      } else {
        showToast("error", response.message || "Không thể chấp nhận lời mời");
      }
    } catch (error: any) {
      showToast("error", error.message || "Đã có lỗi xảy ra");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!userId) return;

    if (!confirm("Bạn có chắc muốn từ chối lời mời này?")) return;

    setIsProcessing(true);
    try {
      const response = await coupleService.rejectInvitation(
        invitation.id,
        userId,
      );
      if (response.success) {
        showToast("success", response.data?.message || "Đã từ chối lời mời");
        onRejected();
      } else {
        showToast("error", response.message || "Không thể từ chối lời mời");
      }
    } catch (error: any) {
      showToast("error", error.message || "Đã có lỗi xảy ra");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-rose-50 text-rose-600">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span>Lời mời kết nối</span>
            </h3>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-rose-50 text-rose-700">
              Đang chờ bạn phản hồi
            </span>
          </div>

          <p className="text-sm text-gray-700 mt-2">
            <span className="font-semibold text-gray-900">
              {invitation.user1.name}
            </span>
            <span className="text-gray-500"> ({invitation.user1.email})</span>{" "}
            đã gửi lời mời kết nối với bạn.
          </p>

          {invitation.coupleName && (
            <p className="text-sm text-gray-600 mt-1">
              Tên cặp đôi:{" "}
              <span className="font-semibold text-gray-800">
                {invitation.coupleName}
              </span>
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <Clock className="w-4 h-4" />
            <span>
              Gửi lúc: {new Date(invitation.createdAt).toLocaleString("vi-VN")}
            </span>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAccept}
              disabled={isProcessing}
              className="sm:flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Chấp nhận</span>
            </button>

            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="sm:flex-1 bg-gray-100 text-gray-800 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Từ chối</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
