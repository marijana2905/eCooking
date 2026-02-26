import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import FooterBasic from './components/FooterBasic';

const AppLayout = () => {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto max-w-6xl flex-1 p-4">
        <Outlet />
      </main>

      <FooterBasic />
    </div>
  );
};

export default AppLayout;
