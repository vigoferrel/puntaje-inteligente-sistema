/* eslint-disable react-refresh/only-export-components */
import { FC, ReactNode } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { AppSidebar } from './app-sidebar';
import { ErrorBoundary } from './ErrorBoundary';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex w-full cinematic-container cinematic-particles">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          {/* Eliminado overflow-hidden duplicado para evitar problemas de scroll */}
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
};

