
import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CinematicAudioProvider } from '@/components/cinematic/UniversalCinematicSystem';
import { NeuralLoadingScreen } from '@/components/neural-command/NeuralLoadingScreen';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

// Lazy loading del NeuralCommandCenter para evitar renders prematuros
const NeuralCommandCenter = React.lazy(() => import('@/components/neural-command/NeuralCommandCenter').then(module => ({
  default: module.NeuralCommandCenter
})));

// Router completamente unificado - SOLO CENTRO NEURAL
const neuralRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter />
      </Suspense>
    )
  },
  {
    path: '/neural-command',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter />
      </Suspense>
    )
  },
  // Todas las rutas redirigen al centro neural con diferentes dimensiones
  {
    path: '/lectoguia',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="neural_training" />
      </Suspense>
    )
  },
  {
    path: '/diagnostico',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="progress_analysis" />
      </Suspense>
    )
  },
  {
    path: '/plan',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="vocational_prediction" />
      </Suspense>
    )
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="universe_exploration" />
      </Suspense>
    )
  },
  {
    path: '/paes',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="battle_mode" />
      </Suspense>
    )
  },
  {
    path: '/paes-dashboard',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="battle_mode" />
      </Suspense>
    )
  },
  {
    path: '/paes-universe',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="universe_exploration" />
      </Suspense>
    )
  },
  {
    path: '/superpaes',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="neural_training" />
      </Suspense>
    )
  },
  {
    path: '/ejercicios',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="neural_training" />
      </Suspense>
    )
  },
  {
    path: '/ejercicios/:subject',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="neural_training" />
      </Suspense>
    )
  },
  {
    path: '/entrenamiento',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="neural_training" />
      </Suspense>
    )
  },
  {
    path: '/analisis',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="progress_analysis" />
      </Suspense>
    )
  },
  {
    path: '/evaluaciones',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="battle_mode" />
      </Suspense>
    )
  },
  {
    path: '/progreso',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="progress_analysis" />
      </Suspense>
    )
  },
  {
    path: '/calendario',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="calendar_management" />
      </Suspense>
    )
  },
  {
    path: '/settings',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="settings_control" />
      </Suspense>
    )
  },
  {
    path: '/configuracion',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="settings_control" />
      </Suspense>
    )
  },
  {
    path: '/finanzas',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="financial_center" />
      </Suspense>
    )
  },
  {
    path: '/centro-financiero',
    element: (
      <Suspense fallback={<NeuralLoadingScreen />}>
        <NeuralCommandCenter initialDimension="financial_center" />
      </Suspense>
    )
  },
  // Rutas especiales
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export const NeuralRouter: React.FC = () => {
  return (
    <CinematicAudioProvider>
      <RouterProvider router={neuralRouter} />
    </CinematicAudioProvider>
  );
};
