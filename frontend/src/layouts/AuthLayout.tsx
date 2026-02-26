import { Navigate, Outlet } from 'react-router-dom';

import { useIsAuthenticated } from '@/stores/auth.store';

import Logo from '@/components/common/Logo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import FooterBasic from './components/FooterBasic';

const AuthLayout = () => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between">
      <header className="flex w-full items-center justify-center border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 p-4">
          <Logo size={120} />
          <ThemeToggle />
        </div>
      </header>

      <div className="flex w-full max-w-6xl grow items-center justify-center p-4">
        <Outlet />
      </div>

      <FooterBasic />
    </div>
  );
};

export default AuthLayout;
