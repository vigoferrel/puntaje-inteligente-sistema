
import { createBrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import NewIndex from '@/pages/NewIndex';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <NewIndex />,
  },
  {
    path: '/old-home',
    element: <Index />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
]);
