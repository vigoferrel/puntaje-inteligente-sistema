
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';

interface NeuralLayoutProps {
  children: React.ReactNode;
}

export const NeuralLayout: React.FC<NeuralLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white w-full flex font-poppins">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <AppHeader />
          
          <main className="flex-1 relative overflow-hidden">
            {/* Cosmic Background Animation */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000" />
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <div className="relative z-10 container mx-auto py-8 px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
