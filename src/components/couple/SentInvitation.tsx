import { useState } from "react";
import { Clock, X, AlertCircle, Send, RotateCcw } from "lucide-react";
import {
  CoupleDetail,
  CoupleStatus,
  coupleService,
} from "../../services/coupleService";
import { useAuth } from "../../contexts/AuthContext";
import { useUI } from "../../contexts/UIContext";

interface SentInvitationProps {
  invitation: CoupleDetail;
  onCancelled: () => void;
  onResend?: (email: string) => void;
}

export default function SentInvitation({
  invitation,
  onCancelled,
  onResend,
}: SentInvitationProps) {
  const { userId } = useAuth();
  const { showToast } = useUI();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCancel = async () => {
    if (!userId) return;

    if (!confirm("Bạn có chắc muốn hủy lời mời này?")) return;

    setIsProcessing(true);
    try {
      const response = await coupleService.cancelInvitation(
        invitation.id,
        userId,
      );
      if (response.success) {
        showToast("success", response.data?.message || "Đã hủy lời mời");
        onCancelled();
      } else {
        showToast("error", response.message || "Không thể hủy lời mời");
      }
    } catch (error: any) {
      showToast("error", error.message || "Đã có lỗi xảy ra");
    } finally {
      setIsProcessing(false);
    }
  };

  const isRejected = invitation.status === CoupleStatus.Rejected;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isRejected ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
            }`}
          >
            {isRejected ? (
              <AlertCircle className="w-6 h-6" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {isRejected ? "Lời mời bị từ chối" : "Lời mời đã gửi"}
            </h3>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                isRejected
                  ? "bg-red-50 text-red-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {isRejected ? "Đã từ chối" : "Đang chờ"}
            </span>
          </div>

          <p className="text-sm text-gray-700 mt-2">
            Bạn đã gửi lời mời kết nối đến{" "}
            <span className="font-semibold text-gray-900">
              {invitation.user2.name}
            </span>
            <span className="text-gray-500"> ({invitation.user2.email})</span>
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

          {isRejected && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-800">
                Đối phương đã từ chối lời mời. Bạn có thể mời lại.
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            {isRejected && (
              <button
                onClick={() => onResend?.(invitation.user2.email)}
                className="sm:flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Mời lại</span>
              </button>
            )}

            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className={`${isRejected ? "sm:flex-1" : "w-full"} bg-gray-100 text-gray-800 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              <X className="w-4 h-4" />
              <span>{isRejected ? "Xóa lời mời" : "Hủy lời mời"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
