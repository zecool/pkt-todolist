import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to from location or home after login
  const from = location.state?.from?.pathname || "/";

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(formData.email, formData.password);
      // Redirect to the original location or home
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled in the auth store
      console.error('로그인 실패:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading message="로그인 중..." />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-[#212121]">로그인</h2>
          <p className="mt-2 text-sm text-[#757575]">계정에 로그인하세요</p>
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
              label="비밀번호"
              id="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
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
              로그인
            </Button>
          </div>

          <div className="text-center text-sm">
            <p className="text-[#757575]">
              계정이 없으신가요?{' '}
              <a href="/register" className="font-medium text-[#00C73C] hover:text-[#008A28]">
                회원가입
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;