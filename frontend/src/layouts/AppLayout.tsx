import { Outlet } from 'react-router-dom';
import LeftSidebar from '@/components/common/LeftSidebar';
import MobileNavbar from '@/components/common/MobileNavbar';

const AppLayout = () => {
  return (
    <div className="relative flex min-h-screen w-full">
      <aside className="bg-background fixed top-0 left-0 hidden h-screen w-64 border-r md:block">
        <LeftSidebar />
      </aside>

      <main className="flex-1 md:pl-64">
        <div className="container mx-auto max-w-5xl px-4 py-6 pb-24 md:pb-6">
          <Outlet />
        </div>
      </main>

      <div className="md:hidden">
        <MobileNavbar />
      </div>
    </div>
  );
};

export default AppLayout;
