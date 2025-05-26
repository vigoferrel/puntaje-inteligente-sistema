
import React from 'react';
import { AppSidebar } from './app-sidebar';
import { ErrorBoundary } from './ErrorBoundary';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};
