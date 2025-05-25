
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '@/components/app-header';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
