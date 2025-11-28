import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    passwordConfirm: ''
  });
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }
    
    if (!formData.username) {
      newErrors.username = '사용자 이름을 입력해주세요';
    } else if (formData.username.length < 2) {
      newErrors.username = '사용자 이름은 최소 2자 이상이어야 합니다';
    } else if (formData.username.length > 50) {
      newErrors.username = '사용자 이름은 50자를 넘을 수 없습니다';
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 최소 8자 이상이어야 합니다';
    }
    
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호를 다시 입력해주세요';
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await registerUser(formData.email, formData.password, formData.username);
    if (result.success) {
      // 회원가입 성공 후 메인 페이지로 이동 (이미 토큰이 저장됨)
      navigate('/');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl my-8">
        <div>
          <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-2xl text-green-600 font-bold">_pkt</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            새 계정 만들기
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                id="email"
                name="email"
                label="이메일"
                type="email"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon="📧"
              />
            </div>
            <div>
              <Input
                id="username"
                name="username"
                label="사용자 이름"
                type="text"
                placeholder="사용자 이름을 입력하세요"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                icon="👤"
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                label="비밀번호"
                type="password"
                placeholder="비밀번호를 입력하세요"
                showPasswordToggle
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon="🔒"
              />
              <p className="mt-1 text-xs text-gray-500">최소 8자 이상</p>
            </div>
            <div>
              <Input
                id="passwordConfirm"
                name="passwordConfirm"
                label="비밀번호 확인"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                showPasswordToggle
                value={formData.passwordConfirm}
                onChange={handleChange}
                error={errors.passwordConfirm}
                icon="🔒"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? '회원가입 중...' : '회원가입'}
            </Button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;