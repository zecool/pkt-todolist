import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { userService } from '../services/userService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const [profileData, setProfileData] = useState({
    email: '',
    username: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        setProfileData({
          email: response.data.email,
          username: response.data.username,
        });
      } catch (error) {
        console.error('프로필 정보를 불러오는 데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    setProfileData({
      email: user.email,
      username: user.username,
    });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      await userService.updateProfile(profileData);
      setIsEditing(false);
      setMessage('프로필이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      setMessage(error.response?.data?.error?.message || '프로필 업데이트에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading message="프로필 정보를 불러오는 중..." />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#212121]">프로필</h1>
        <p className="text-[#757575] mt-1">사용자 정보를 확인하고 관리하세요</p>
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded-lg ${message.includes('성공') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Input
              label="이메일"
              id="email"
              type="email"
              value={profileData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div>
            <Input
              label="사용자 이름"
              id="username"
              type="text"
              value={profileData.username}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="사용자 이름을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#212121] mb-1">역할</label>
            <div className="px-4 py-3 bg-gray-50 rounded-lg border border-[#E0E0E0]">
              {user?.role === 'admin' ? '관리자' : '일반 사용자'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#212121] mb-1">가입일</label>
            <div className="px-4 py-3 bg-gray-50 rounded-lg border border-[#E0E0E0]">
              {user && new Date(user.createdAt).toLocaleDateString('ko-KR')}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <div>
            {isEditing ? (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSaving}
              >
                취소
              </Button>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleEdit}
              >
                정보 수정
              </Button>
            )}
          </div>
          
          <div className="flex space-x-2">
            {isEditing && (
              <Button 
                type="submit" 
                variant="primary"
                loading={isSaving}
              >
                저장
              </Button>
            )}
          </div>
        </div>
      </form>

      <div className="mt-12 pt-6 border-t border-[#E0E0E0]">
        <h2 className="text-lg font-semibold text-[#212121] mb-4">계정 관리</h2>
        <div className="flex justify-end">
          <Button 
            variant="danger" 
            onClick={() => {
              if (window.confirm('정말 로그아웃 하시겠습니까?')) {
                logout();
              }
            }}
          >
            로그아웃
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;