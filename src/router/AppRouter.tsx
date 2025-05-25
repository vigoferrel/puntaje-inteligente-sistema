
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { CinematicAudioProvider, CinematicControls } from '@/components/cinematic/UniversalCinematicSystem';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import Index from '@/pages/Index';
import LectoGuia from '@/pages/LectoGuia';
import Diagnostico from '@/pages/Diagnostico';
import Plan from '@/pages/Plan';
import Progreso from '@/pages/Progreso';
import Evaluacion from '@/pages/Evaluacion';
import SuperPAES from '@/pages/SuperPAES';
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
import NotFound from '@/pages/NotFound';

// Layout neurológico unificado con Sidebar integrado
const NeuralLayout: React.FC = () => (
  <CinematicAudioProvider>
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <AppHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <CinematicControls />
        </SidebarInset>
      </div>
    </SidebarProvider>
  </CinematicAudioProvider>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <NeuralLayout />,
    children: [
      { path: '/', element: <Index /> },
      { path: '/lectoguia', element: <LectoGuia /> },
      { path: '/diagnostico', element: <Diagnostico /> },
      { path: '/plan', element: <Plan /> },
      { path: '/planes-estudio', element: <Plan /> },
      { path: '/progreso', element: <Progreso /> },
      { path: '/evaluacion', element: <Evaluacion /> },
      { path: '/evaluaciones', element: <Evaluacion /> },
      { path: '/superpaes', element: <SuperPAES /> },
      { path: '/paes-dashboard', element: <PAESDashboard /> },
      { path: '/paes-universe', element: <PAESUniversePage /> },
      { path: '/paes', element: <PAES /> },
      { path: '/materia/:subject', element: <SubjectDetail /> },
      { path: '/ejercicios', element: <Ejercicios /> },
      { path: '/ejercicios/:subject', element: <Ejercicios /> },
      { path: '/settings', element: <Settings /> },
      { path: '/configuracion', element: <Settings /> },
      { path: '/entrenamiento', element: <Entrenamiento /> },
      { path: '/analisis', element: <Analisis /> },
      { path: '/calendario', element: <Calendario /> },
      { path: '/finanzas', element: <Finanzas /> },
      { path: '/centro-financiero', element: <Finanzas /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/login', element: <Login /> },
      { path: '*', element: <NotFound /> }
    ]
  }
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
