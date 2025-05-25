
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AppLayout } from '@/components/app-layout';
import Index from '@/pages/Index';
import LectoGuia from '@/pages/LectoGuia';
import Diagnostico from '@/pages/Diagnostico';
import Plan from '@/pages/Plan';
import PAESDashboard from '@/pages/PAESDashboard';
import PAESUniversePage from '@/pages/PAESUniversePage';
import SubjectDetail from '@/pages/SubjectDetail';
import Settings from '@/pages/Settings';
import Evaluaciones from '@/pages/Evaluaciones';
import Entrenamiento from '@/pages/Entrenamiento';
import Analisis from '@/pages/Analisis';
import Login from '@/pages/Login';
import Calendario from '@/pages/Calendario';
import Ejercicios from '@/pages/Ejercicios';
import Finanzas from '@/pages/Finanzas';
import Dashboard from '@/pages/Dashboard';
import PAES from '@/pages/PAES';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout><Outlet /></AppLayout>,
    children: [
      { path: '/', element: <Index /> },
      { path: '/lectoguia', element: <LectoGuia /> },
      { path: '/diagnostico', element: <Diagnostico /> },
      { path: '/plan', element: <Plan /> },
      { path: '/planes-estudio', element: <Plan /> },
      { path: '/paes-dashboard', element: <PAESDashboard /> },
      { path: '/paes-universe', element: <PAESUniversePage /> },
      { path: '/paes', element: <PAES /> },
      { path: '/materia/:subject', element: <SubjectDetail /> },
      { path: '/ejercicios', element: <Ejercicios /> },
      { path: '/ejercicios/:subject', element: <Ejercicios /> },
      { path: '/settings', element: <Settings /> },
      { path: '/configuracion', element: <Settings /> },
      { path: '/evaluaciones', element: <Evaluaciones /> },
      { path: '/entrenamiento', element: <Entrenamiento /> },
      { path: '/analisis', element: <Analisis /> },
      { path: '/calendario', element: <Calendario /> },
      { path: '/finanzas', element: <Finanzas /> },
      { path: '/centro-financiero', element: <Finanzas /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/login', element: <Login /> }
    ]
  }
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
