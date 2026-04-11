import { useState, useEffect } from "react";
import { User, Heart, Mail, Calendar, LogOut, UserPlus } from "lucide-react";
import {
  userService,
  coupleService,
  UserProfile,
  CoupleDetail,
  InvitationDto,
} from "../services";
import { useAuth } from "../contexts/AuthContext";
import { useUI } from "../contexts/UIContext";
import PendingInvitation from "../components/couple/PendingInvitation";
import SentInvitation from "../components/couple/SentInvitation";

export default function Profile() {
  const { userId, updateCoupleId, logout } = useAuth();
  const { showToast } = useUI();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [couple, setCouple] = useState<CoupleDetail | null>(null);
  const [pendingInvitation, setPendingInvitation] =
    useState<CoupleDetail | null>(null);
  const [sentInvitation, setSentInvitation] = useState<CoupleDetail | null>(
    null,
  );
  const [pendingInvitations, setPendingInvitations] = useState<CoupleDetail[]>(
    [],
  );
  const [sentInvitations, setSentInvitations] = useState<CoupleDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showInvitationHistory, setShowInvitationHistory] = useState<
    null | "pending" | "sent"
  >(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [coupleName, setCoupleName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    if (!userId) return;

    try {
      const profileRes = await userService.getProfile(userId);
      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);

        setCouple(null);
        setPendingInvitation(null);
        setSentInvitation(null);
        setPendingInvitations([]);
        setSentInvitations([]);

        let hasActiveCouple = false;
        if (profileRes.data.hasCouple && userId) {
          try {
            const coupleRes = await coupleService.getCoupleByUserId(userId);
            if (coupleRes.success && coupleRes.data) {
              setCouple(coupleRes.data);
              updateCoupleId(coupleRes.data.id);
              hasActiveCouple = true;
            }
          } catch (error) {}
        }

        if (!hasActiveCouple && userId) {
          try {
            const invitationRes =
              await coupleService.getPendingInvitation(userId);
            if (invitationRes.success && invitationRes.data) {
              setPendingInvitation(invitationRes.data);
            }
          } catch (error) {}

          try {
            const invitationListRes =
              await coupleService.getPendingInvitations(userId);
            if (invitationListRes.success && invitationListRes.data) {
              setPendingInvitations(invitationListRes.data);
            }
          } catch (error) {}

          try {
            const sentRes = await coupleService.getSentInvitation(userId);
            if (sentRes.success && sentRes.data) {
              setSentInvitation(sentRes.data);
            }
          } catch (error) {}

          try {
            const sentListRes = await coupleService.getSentInvitations(userId);
            if (sentListRes.success && sentListRes.data) {
              setSentInvitations(sentListRes.data);
            }
          } catch (error) {}
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptFromHistory = async (coupleId: number) => {
    if (!userId) return;
    try {
      const response = await coupleService.acceptInvitation(coupleId, userId);
      if (response.success) {
        showToast("success", response.data?.message || "Đã chấp nhận lời mời");
        setShowInvitationHistory(null);
        loadProfile();
      }
    } catch (error: any) {
      showToast("error", error.message || "Đã có lỗi xảy ra");
    }
  };

  const handleRejectFromHistory = async (coupleId: number) => {
    if (!userId) return;
    if (!confirm("Bạn có chắc muốn từ chối lời mời này?")) return;
    try {
      const response = await coupleService.rejectInvitation(coupleId, userId);
      if (response.success) {
        showToast("success", response.data?.message || "Đã từ chối lời mời");
        loadProfile();
      }
    } catch (error: any) {
      showToast("error", error.message || "Đã có lỗi xảy ra");
    }
  };

  const handleCancelFromHistory = async (coupleId: number) => {
    if (!userId) return;
    if (!confirm("Bạn có chắc muốn hủy lời mời này?")) return;
    try {
      const response = await coupleService.cancelInvitation(coupleId, userId);
      if (response.success) {
        showToast("success", response.data?.message || "Đã hủy lời mời");
        loadProfile();
      }
    } catch (error: any) {
      showToast("error", error.message || "Đã có lỗi xảy ra");
    }
  };

  const handleSendInvitation = async () => {
    if (!inviteEmail || !userId) return;

    try {
      const dto: InvitationDto = {
        partnerEmail: inviteEmail,
        coupleName: coupleName || undefined,
      };

      const response = await coupleService.sendInvitation(userId, dto);
      if (response.success && response.data) {
        setMessage(response.data.message);
        if (response.data.success) {
          setShowInviteModal(false);
          setInviteEmail("");
          setCoupleName("");
          showToast("success", response.data.message);
          loadProfile();
        } else {
          showToast("error", response.data.message);
        }
      }
    } catch (error: any) {
      setMessage(error.message || "Đã có lỗi xảy ra");
      showToast("error", error.message || "Đã có lỗi xảy ra");
    }
  };

  const handleInvitationAccepted = () => {
    setPendingInvitation(null);
    loadProfile();
  };

  const handleInvitationRejected = () => {
    setPendingInvitation(null);
  };

  const handleSentInvitationCancelled = () => {
    setSentInvitation(null);
  };

  const handleResendInvitation = (email: string) => {
    setMessage("");
    setInviteEmail(email);
    setShowInviteModal(true);
  };

  const handleLogout = () => {
    logout();
    showToast("info", "Đã đăng xuất");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Pending Invitation - Người nhận */}
      {pendingInvitation && (
        <div className="mb-6">
          <PendingInvitation
            invitation={pendingInvitation}
            onAccepted={handleInvitationAccepted}
            onRejected={handleInvitationRejected}
          />
          {pendingInvitations.length > 1 && (
            <div className="mt-3 text-right">
              <button
                onClick={() => setShowInvitationHistory("pending")}
                className="text-sm font-semibold text-gray-700 hover:text-gray-900"
              >
                Xem tất cả ({pendingInvitations.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sent Invitation - Người gửi */}
      {sentInvitation && (
        <div className="mb-6">
          <SentInvitation
            invitation={sentInvitation}
            onCancelled={handleSentInvitationCancelled}
            onResend={handleResendInvitation}
          />
          {sentInvitations.length > 1 && (
            <div className="mt-3 text-right">
              <button
                onClick={() => setShowInvitationHistory("sent")}
                className="text-sm font-semibold text-gray-700 hover:text-gray-900"
              >
                Xem tất cả ({sentInvitations.length})
              </button>
            </div>
          )}
        </div>
      )}

      {showInvitationHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {showInvitationHistory === "pending"
                  ? "Lời mời bạn nhận"
                  : "Lời mời bạn đã gửi"}
              </h3>
              <button
                onClick={() => setShowInvitationHistory(null)}
                className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 transition"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-auto pr-1">
              {(showInvitationHistory === "pending"
                ? pendingInvitations
                : sentInvitations
              ).map((inv) => (
                <div
                  key={inv.id}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {showInvitationHistory === "pending" ? (
                        <p className="text-sm text-gray-800">
                          <span className="font-semibold">
                            {inv.user1.name}
                          </span>
                          <span className="text-gray-500">
                            {" "}
                            ({inv.user1.email})
                          </span>
                        </p>
                      ) : (
                        <p className="text-sm text-gray-800">
                          <span className="font-semibold">
                            {inv.user2.name}
                          </span>
                          <span className="text-gray-500">
                            {" "}
                            ({inv.user2.email})
                          </span>
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(inv.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>

                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {inv.status === 0
                        ? "Pending"
                        : inv.status === 1
                          ? "Active"
                          : "Rejected"}
                    </span>
                  </div>

                  {showInvitationHistory === "pending" && inv.status === 0 && (
                    <div className="mt-3 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleAcceptFromHistory(inv.id)}
                        className="sm:flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition"
                      >
                        Chấp nhận
                      </button>
                      <button
                        onClick={() => handleRejectFromHistory(inv.id)}
                        className="sm:flex-1 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                      >
                        Từ chối
                      </button>
                    </div>
                  )}

                  {showInvitationHistory === "sent" &&
                    (inv.status === 0 || inv.status === 2) && (
                      <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        {inv.status === 2 && (
                          <button
                            onClick={() =>
                              handleResendInvitation(inv.user2.email)
                            }
                            className="sm:flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                          >
                            Mời lại
                          </button>
                        )}
                        <button
                          onClick={() => handleCancelFromHistory(inv.id)}
                          className={`${inv.status === 2 ? "sm:flex-1" : "w-full"} bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition`}
                        >
                          {inv.status === 2 ? "Xóa lời mời" : "Hủy lời mời"}
                        </button>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Thông tin cá nhân
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={20} />
            Đăng xuất
          </button>
        </div>

        {/* User Info */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {profile?.name}
              </h2>
              <p className="text-gray-600 flex items-center gap-2">
                <Mail size={16} />
                {profile?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            <span>
              Tham gia:{" "}
              {new Date(profile?.createdAt || "").toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>

        {/* Couple Info */}
        <div className="border-t pt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="text-pink-500" size={24} />
            Thông tin cặp đôi
          </h3>

          {couple ? (
            <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl p-6">
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-800">
                  {couple.coupleName || "Chưa đặt tên"}
                </p>
                <p className="text-sm text-gray-600">
                  Kết nối từ:{" "}
                  {new Date(couple.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Người 1</p>
                  <p className="font-semibold text-gray-800">
                    {couple.user1.name}
                  </p>
                  <p className="text-sm text-gray-600">{couple.user1.email}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Người 2</p>
                  <p className="font-semibold text-gray-800">
                    {couple.user2.name}
                  </p>
                  <p className="text-sm text-gray-600">{couple.user2.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Bạn chưa có cặp đôi</p>
              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
              >
                <UserPlus size={20} />
                Mời kết nối
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Mời kết nối</h3>

            {message && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
                {message}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email đối phương
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="partner@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên cặp đôi (tùy chọn)
                </label>
                <input
                  type="text"
                  value={coupleName}
                  onChange={(e) => setCoupleName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="Minh & Hương"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSendInvitation}
                  className="flex-1 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
                >
                  Gửi lời mời
                </button>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setMessage("");
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
