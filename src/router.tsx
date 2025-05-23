import { createBrowserRouter } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Plan from './pages/Plan';
import Entrenamiento from './pages/Entrenamiento';
import NodeDetail from './pages/NodeDetail';
import Settings from './pages/Settings';
import LectoGuia from './pages/LectoGuia';
import Evaluaciones from './pages/Evaluaciones';
import Diagnostico from './pages/Diagnostico';
import Analisis from './pages/Analisis';
import Reforzamiento from './pages/Reforzamiento';
import Contenido from './pages/Contenido';
import Simulaciones from './pages/Simulaciones';
import NotFound from './pages/NotFound';

// Admin pages
import GeneradorDiagnostico from './pages/admin/GeneradorDiagnostico';

import { ProtectedRoute } from './components/protected-route';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    errorElement: <NotFound />
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/plan',
    element: <ProtectedRoute><Plan /></ProtectedRoute>
  },
  {
    path: '/entrenamiento',
    element: <ProtectedRoute><Entrenamiento /></ProtectedRoute>
  },
  {
    path: '/evaluaciones',
    element: <ProtectedRoute><Evaluaciones /></ProtectedRoute>
  },
  {
    path: '/diagnostico',
    element: <ProtectedRoute><Diagnostico /></ProtectedRoute>
  },
  {
    path: '/analisis',
    element: <ProtectedRoute><Analisis /></ProtectedRoute>
  },
  {
    path: '/reforzamiento',
    element: <ProtectedRoute><Reforzamiento /></ProtectedRoute>
  },
  {
    path: '/node/:nodeId',
    element: <ProtectedRoute><NodeDetail /></ProtectedRoute>
  },
  {
    path: '/contenido',
    element: <ProtectedRoute><Contenido /></ProtectedRoute>
  },
  {
    path: '/simulaciones',
    element: <ProtectedRoute><Simulaciones /></ProtectedRoute>
  },
  {
    path: '/lectoguia',
    element: <ProtectedRoute><LectoGuia /></ProtectedRoute>
  },
  {
    path: '/settings',
    element: <ProtectedRoute><Settings /></ProtectedRoute>
  },
  {
    path: '/admin/diagnostico',
    element: <ProtectedRoute adminOnly><GeneradorDiagnostico /></ProtectedRoute>
  },
]);
