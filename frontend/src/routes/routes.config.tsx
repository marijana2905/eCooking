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
import RecipeDetailsPage from '@/pages/RecipeDetails';
import LikedRecipesPage from '@/pages/LikedRecipes';
import UserProfilePage from '@/pages/UserProfile';

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
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/recipes/:id', element: <RecipeDetailsPage /> },
          { path: '/liked', element: <LikedRecipesPage /> },
          { path: '/users/:id', element: <UserProfilePage /> },
        ],
      },
    ],
  },
  {
    element: <EmptyLayout />,
    children: [{ path: '*', element: <NotFoundPage /> }],
  },
]);
