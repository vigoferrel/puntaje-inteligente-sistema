
import React, { Suspense, useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, useSearchParams } from 'react-router-dom';
import { CinematicAudioProvider } from '@/components/cinematic/UniversalCinematicSystem';
import { NeuralLoadingScreen } from '@/components/neural-command/NeuralLoadingScreen';
import { UnifiedSystemContainer } from '@/components/unified-system/UnifiedSystemContainer';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

// Lazy loading components for optimal performance
const NeuralCommandCenter = React.lazy(() => import('@/components/neural-command/NeuralCommandCenter').then(module => ({
  default: module.NeuralCommandCenter
})));

// Unified router with intelligent system detection
const createUnifiedRouter = () => createBrowserRouter([
  {
    path: '/',
    element: <UnifiedSystemContainer />
  },
  {
    path: '/neural',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter />
      </Suspense>
    )
  },
  {
    path: '/neural/:dimension',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter />
      </Suspense>
    )
  },
  // All legacy routes redirect to unified system with proper context
  {
    path: '/lectoguia',
    element: <UnifiedSystemContainer initialTool="lectoguia" />
  },
  {
    path: '/diagnostico',
    element: <UnifiedSystemContainer initialTool="diagnostic" />
  },
  {
    path: '/dashboard',
    element: <UnifiedSystemContainer initialTool="dashboard" />
  },
  {
    path: '/ejercicios',
    element: <UnifiedSystemContainer initialTool="exercises" />
  },
  {
    path: '/ejercicios/:subject',
    element: <UnifiedSystemContainer initialTool="exercises" />
  },
  {
    path: '/plan',
    element: <UnifiedSystemContainer initialTool="plan" />
  },
  {
    path: '/calendario',
    element: <UnifiedSystemContainer initialTool="calendar" />
  },
  {
    path: '/finanzas',
    element: <UnifiedSystemContainer initialTool="financial" />
  },
  {
    path: '/paes',
    element: <UnifiedSystemContainer initialTool="evaluation" />
  },
  {
    path: '/paes-dashboard',
    element: <UnifiedSystemContainer initialTool="evaluation" />
  },
  {
    path: '/progreso',
    element: <UnifiedSystemContainer initialTool="progress" />
  },
  {
    path: '/settings',
    element: <UnifiedSystemContainer initialTool="settings" />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export const UnifiedSystemRouter: React.FC = () => {
  const router = createUnifiedRouter();

  return (
    <CinematicAudioProvider>
      <RouterProvider router={router} />
    </CinematicAudioProvider>
  );
};
