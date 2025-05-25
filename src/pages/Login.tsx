
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { LoginForm } from '@/components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="w-full max-w-md p-6">
          <LoginForm />
        </div>
      </div>
    </AppLayout>
  );
};

export default Login;
