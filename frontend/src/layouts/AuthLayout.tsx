import { Navigate, Outlet } from 'react-router-dom';

import { useIsAuthenticated } from '@/stores/auth.store';

import Logo from '@/components/common/Logo';
import { ThemeToggle } from '@/components/common/ThemeToggle';

const AuthLayout = () => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between">
      <header className="flex w-full items-center justify-center border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Logo size={120} />
          <ThemeToggle />
        </div>
      </header>

      <div className="container flex w-full grow items-center justify-center p-4">
        <Outlet />
      </div>

      <footer className="text-muted-foreground w-full py-4 text-center text-sm">
        &copy; {new Date().getFullYear()}{' '}
        <a
          href="https://github.com/marijana2905/eCooking"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary underline underline-offset-4"
        >
          eCooking
        </a>
      </footer>
    </div>
  );
};

export default AuthLayout;
