import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      console.error('비밀번호가 일치하지 않습니다');
      return;
    }

    try {
      await register(formData.email, formData.password, formData.username);
      // Redirect to login after successful registration
      navigate('/login');
    } catch (error) {
      // Error is handled in the auth store
      console.error('회원가입 실패:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading message="회원가입 중..." />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-[#212121]">회원가입</h2>
          <p className="mt-2 text-sm text-[#757575]">새로운 계정을 만드세요</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              label="이메일"
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요"
              required
            />

            <Input
              label="사용자 이름"
              id="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="사용자 이름을 입력하세요"
              required
            />

            <Input
              label="비밀번호"
              id="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              required
            />

            <Input
              label="비밀번호 확인"
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              회원가입
            </Button>
          </div>

          <div className="text-center text-sm">
            <p className="text-[#757575]">
              이미 계정이 있으신가요?{' '}
              <a href="/login" className="font-medium text-[#00C73C] hover:text-[#008A28]">
                로그인
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;