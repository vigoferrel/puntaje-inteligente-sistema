
import { createBrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import NewIndex from '@/pages/NewIndex';
import Auth from '@/pages/Auth';

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
    path: '/auth',
    element: <Auth />,
  },
]);
