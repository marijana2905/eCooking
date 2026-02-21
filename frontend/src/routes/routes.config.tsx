import { createBrowserRouter } from 'react-router-dom';

import AuthLayout from '@/layouts/AuthLayout';
import AppLayout from '@/layouts/AppLayout';
import EmptyLayout from '@/layouts/EmptyLayout';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import NotFoundPage from '@/pages/NotFound';
import HomePage from '@/pages/Home';

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [{ path: '/', element: <HomePage /> }],
      },
    ],
  },
  {
    element: <EmptyLayout />,
    children: [{ path: '*', element: <NotFoundPage /> }],
  },
]);
