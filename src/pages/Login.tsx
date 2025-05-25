
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { LoginForm } from '@/components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/');
  };

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="w-full max-w-md p-6">
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Login;
