
import { createBrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import PAESExerciseGenerator from '@/pages/PAESExerciseGenerator';
import SubjectDetail from '@/pages/SubjectDetail';
import PAESDashboard from '@/pages/PAESDashboard';
import LectoGuia from '@/pages/LectoGuia';
import Diagnostico from '@/pages/Diagnostico';
import Plan from '@/pages/Plan';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/paes-dashboard',
    element: <PAESDashboard />,
  },
  {
    path: '/ejercicios',
    element: <PAESExerciseGenerator />,
  },
  {
    path: '/ejercicios/:subject',
    element: <PAESExerciseGenerator />,
  },
  {
    path: '/materia/:subject',
    element: <SubjectDetail />,
  },
  {
    path: '/lectoguia',
    element: <LectoGuia />,
  },
  {
    path: '/diagnostico',
    element: <Diagnostico />,
  },
  {
    path: '/plan',
    element: <Plan />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
]);
