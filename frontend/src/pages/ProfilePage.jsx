import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { User, Mail, Calendar, Edit3, Save, X } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const ProfilePage = () => {
  const { user, isLoading, error, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
  });

  // Update editData when user changes
  useEffect(() => {
    if (user) {
      setEditData({
        username: user.username || '',
      });
    }
  }, [user]);

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Handle input changes for user info
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle user info edit
  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      updateProfile({ username: editData.username });
    }
    setIsEditing(!isEditing);
  };

  // Handle password form input changes
  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = '현재 비밀번호를 입력해주세요';
    }
    
    if (passwordForm.newPassword.length < 8) {
      errors.newPassword = '비밀번호는 최소 8자 이상이어야 합니다';
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      errors.confirmNewPassword = '비밀번호가 일치하지 않습니다';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle password form submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    // This would typically call an API to change the password
    try {
      // In a real application, this would be:
      // const result = await userService.changePassword(passwordForm);
      // if (result.success) {
      //   setIsPasswordModalOpen(false);
      //   setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      //   setPasswordErrors({});
      // } else {
      //   setPasswordErrors({ root: result.error });
      // }
      
      // For this example, we'll just close the modal after a simulated delay
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setPasswordErrors({});
    } catch (error) {
      setPasswordErrors({ root: '비밀번호 변경에 실패했습니다.' });
    }
  };

  // Format the join date
  const joinDate = user?.createdAt ? format(parseISO(user.createdAt), 'yyyy년 MM월 dd일', { locale: ko }) : '';

  return (
    <div className="w-full max-w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">프로필</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">에러 발생</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                <User className="h-12 w-12 text-green-600" />
              </div>
              <div className="ml-6">
                {isEditing ? (
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={editData.username}
                    onChange={handleInputChange}
                    error={null}
                  />
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.username || '사용자'}
                  </h3>
                )}
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  가입일: {joinDate}
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                비밀번호 변경
              </Button>
              <Button
                type="button"
                variant={isEditing ? "primary" : "outline"}
                onClick={handleEdit}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    저장
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4 mr-1" />
                    수정
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-5">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <dt className="flex items-center text-base font-medium text-gray-500 dark:text-gray-400 mr-4">
                <Mail className="h-5 w-5 mr-2" />
                이메일
              </dt>
              <dd className="text-base text-gray-900 dark:text-white">
                {user?.email || '이메일 없음'}
              </dd>
            </div>
            <div className="flex items-start">
              <dt className="flex items-center text-base font-medium text-gray-500 dark:text-gray-400 mr-4">
                <Calendar className="h-5 w-5 mr-2" />
                가입일
              </dt>
              <dd className="text-base text-gray-900 dark:text-white">
                {joinDate || '날짜 없음'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal 
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
          setPasswordErrors({});
        }}
        title="비밀번호 변경"
        size="md"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <Input
              id="currentPassword"
              name="currentPassword"
              label="현재 비밀번호"
              type="password"
              placeholder="현재 비밀번호를 입력하세요"
              value={passwordForm.currentPassword}
              onChange={handlePasswordFormChange}
              error={passwordErrors.currentPassword}
            />
          </div>
          
          <div>
            <Input
              id="newPassword"
              name="newPassword"
              label="새 비밀번호"
              type="password"
              placeholder="새 비밀번호를 입력하세요"
              value={passwordForm.newPassword}
              onChange={handlePasswordFormChange}
              error={passwordErrors.newPassword}
            />
          </div>
          
          <div>
            <Input
              id="confirmNewPassword"
              name="confirmNewPassword"
              label="새 비밀번호 확인"
              type="password"
              placeholder="새 비밀번호를 다시 입력하세요"
              value={passwordForm.confirmNewPassword}
              onChange={handlePasswordFormChange}
              error={passwordErrors.confirmNewPassword}
            />
          </div>
          
          {passwordErrors.root && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{passwordErrors.root}</h3>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsPasswordModalOpen(false);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
                setPasswordErrors({});
              }}
            >
              <X className="h-4 w-4 mr-1" />
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              <Save className="h-4 w-4 mr-1" />
              변경
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;