import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
