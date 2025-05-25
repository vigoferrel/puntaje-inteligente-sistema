
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CinematicAudioProvider } from '@/components/cinematic/UniversalCinematicSystem';
import { NeuralCommandCenter } from '@/components/neural-command/NeuralCommandCenter';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

// Router completamente unificado - SOLO CENTRO NEURAL
const neuralRouter = createBrowserRouter([
  {
    path: '/',
    element: <NeuralCommandCenter />
  },
  {
    path: '/neural-command',
    element: <NeuralCommandCenter />
  },
  // Todas las rutas redirigen al centro neural con diferentes dimensiones
  {
    path: '/lectoguia',
    element: <NeuralCommandCenter initialDimension="neural_training" />
  },
  {
    path: '/diagnostico',
    element: <NeuralCommandCenter initialDimension="progress_analysis" />
  },
  {
    path: '/plan',
    element: <NeuralCommandCenter initialDimension="vocational_prediction" />
  },
  {
    path: '/dashboard',
    element: <NeuralCommandCenter initialDimension="universe_exploration" />
  },
  {
    path: '/paes',
    element: <NeuralCommandCenter initialDimension="battle_mode" />
  },
  {
    path: '/paes-dashboard',
    element: <NeuralCommandCenter initialDimension="battle_mode" />
  },
  {
    path: '/paes-universe',
    element: <NeuralCommandCenter initialDimension="universe_exploration" />
  },
  {
    path: '/superpaes',
    element: <NeuralCommandCenter initialDimension="neural_training" />
  },
  {
    path: '/ejercicios',
    element: <NeuralCommandCenter initialDimension="neural_training" />
  },
  {
    path: '/ejercicios/:subject',
    element: <NeuralCommandCenter initialDimension="neural_training" />
  },
  {
    path: '/entrenamiento',
    element: <NeuralCommandCenter initialDimension="neural_training" />
  },
  {
    path: '/analisis',
    element: <NeuralCommandCenter initialDimension="progress_analysis" />
  },
  {
    path: '/evaluaciones',
    element: <NeuralCommandCenter initialDimension="battle_mode" />
  },
  {
    path: '/progreso',
    element: <NeuralCommandCenter initialDimension="progress_analysis" />
  },
  {
    path: '/calendario',
    element: <NeuralCommandCenter initialDimension="calendar_management" />
  },
  {
    path: '/settings',
    element: <NeuralCommandCenter initialDimension="settings_control" />
  },
  {
    path: '/configuracion',
    element: <NeuralCommandCenter initialDimension="settings_control" />
  },
  {
    path: '/finanzas',
    element: <NeuralCommandCenter initialDimension="financial_center" />
  },
  {
    path: '/centro-financiero',
    element: <NeuralCommandCenter initialDimension="financial_center" />
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
