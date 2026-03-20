import { useState, useEffect } from 'react';
import { User, Heart, Mail, Calendar, LogOut, UserPlus } from 'lucide-react';
import { userService, coupleService, authService, UserProfile, CoupleDetail, InvitationDto } from '../services';

interface ProfileProps {
  userId: number;
  onLogout: () => void;
}

export default function Profile({ userId, onLogout }: ProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [couple, setCouple] = useState<CoupleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [coupleName, setCoupleName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const profileRes = await userService.getProfile(userId);
      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);

        if (profileRes.data.hasCouple) {
          const coupleRes = await coupleService.getCoupleByUserId(userId);
          if (coupleRes.success && coupleRes.data) {
            setCouple(coupleRes.data);
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitation = async () => {
    if (!inviteEmail) return;

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
          loadProfile(); // Reload to get couple info
        }
      }
    } catch (error: any) {
      setMessage(error.message || 'Đã có lỗi xảy ra');
    }
  };

  const handleLogout = () => {
    authService.logout();
    onLogout();
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
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Thông tin cá nhân</h1>
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
              <h2 className="text-2xl font-bold text-gray-800">{profile?.name}</h2>
              <p className="text-gray-600 flex items-center gap-2">
                <Mail size={16} />
                {profile?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            <span>Tham gia: {new Date(profile?.createdAt || '').toLocaleDateString('vi-VN')}</span>
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
                  {couple.coupleName || 'Chưa đặt tên'}
                </p>
                <p className="text-sm text-gray-600">
                  Kết nối từ: {new Date(couple.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Người 1</p>
                  <p className="font-semibold text-gray-800">{couple.user1.name}</p>
                  <p className="text-sm text-gray-600">{couple.user1.email}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Người 2</p>
                  <p className="font-semibold text-gray-800">{couple.user2.name}</p>
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
                    setMessage('');
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
