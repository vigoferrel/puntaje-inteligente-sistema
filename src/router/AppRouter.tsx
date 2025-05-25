import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AppLayout } from '@/components/app-layout';
import { UniversalTransition, CinematicAudioProvider, CinematicControls } from '@/components/cinematic/UniversalCinematicSystem';
import { CinematicTransition } from '@/components/cinematic/CinematicTransitionSystem';
import Index from '@/pages/Index';
import LectoGuia from '@/pages/LectoGuia';
import Diagnostico from '@/pages/Diagnostico';
import Plan from '@/pages/Plan';
import Progreso from '@/pages/Progreso';
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

// Componente wrapper para páginas con transiciones cinematográficas
const CinematicPageWrapper: React.FC<{ children: React.ReactNode; scene: string }> = ({ children, scene }) => (
  <UniversalTransition scene={scene}>
    {children}
  </UniversalTransition>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <CinematicAudioProvider>
        <AppLayout>
          <Outlet />
          <CinematicControls />
        </AppLayout>
      </CinematicAudioProvider>
    ),
    children: [
      { 
        path: '/', 
        element: (
          <CinematicPageWrapper scene="dashboard">
            <Index />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/lectoguia', 
        element: (
          <CinematicPageWrapper scene="lectoguia">
            <LectoGuia />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/diagnostico', 
        element: (
          <CinematicPageWrapper scene="diagnostic">
            <Diagnostico />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/plan', 
        element: (
          <CinematicPageWrapper scene="plan">
            <Plan />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/planes-estudio', 
        element: (
          <CinematicPageWrapper scene="plan">
            <Plan />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/progreso', 
        element: (
          <CinematicPageWrapper scene="progress">
            <Progreso />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/paes-dashboard', 
        element: (
          <CinematicPageWrapper scene="paes">
            <PAESDashboard />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/paes-universe', 
        element: (
          <CinematicPageWrapper scene="universe">
            <PAESUniversePage />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/paes', 
        element: (
          <CinematicPageWrapper scene="paes">
            <PAES />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/materia/:subject', 
        element: (
          <CinematicPageWrapper scene="subject">
            <SubjectDetail />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/ejercicios', 
        element: (
          <CinematicPageWrapper scene="exercises">
            <Ejercicios />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/ejercicios/:subject', 
        element: (
          <CinematicPageWrapper scene="exercises">
            <Ejercicios />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/settings', 
        element: (
          <CinematicPageWrapper scene="settings">
            <Settings />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/configuracion', 
        element: (
          <CinematicPageWrapper scene="settings">
            <Settings />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/evaluaciones', 
        element: (
          <CinematicPageWrapper scene="evaluation">
            <Evaluaciones />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/entrenamiento', 
        element: (
          <CinematicPageWrapper scene="training">
            <Entrenamiento />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/analisis', 
        element: (
          <CinematicPageWrapper scene="analysis">
            <Analisis />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/calendario', 
        element: (
          <CinematicPageWrapper scene="calendar">
            <Calendario />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/finanzas', 
        element: (
          <CinematicPageWrapper scene="finances">
            <Finanzas />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/centro-financiero', 
        element: (
          <CinematicPageWrapper scene="finances">
            <Finanzas />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/dashboard', 
        element: (
          <CinematicPageWrapper scene="dashboard">
            <Dashboard />
          </CinematicPageWrapper>
        )
      },
      { 
        path: '/login', 
        element: (
          <CinematicPageWrapper scene="auth">
            <Login />
          </CinematicPageWrapper>
        )
      }
    ]
  }
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
