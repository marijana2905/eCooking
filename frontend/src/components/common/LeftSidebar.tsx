import { NavLink } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';
import { sidebarLinks } from '@/config/sidebarLinks';
import { useAuthUser } from '@/stores/auth.store';
import { buttonVariants } from '@/components/ui/button';
import Logo from './Logo';
import CurrentUserAvatar from './CurrentUserAvatar';

const LeftSidebar = () => {
  const user = useAuthUser();

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-12 flex flex-col items-center justify-center gap-3 text-center">
        <Logo size={64} className="text-primary" />
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-2">
        {sidebarLinks.map((link) => {
          const isProfile = link.label === 'Profile';
          const targetPath =
            isProfile && user?.username ? `/users/${user.username}` : link.to;

          return (
            <NavLink
              key={link.label}
              to={targetPath}
              className={({ isActive }) =>
                cn(
                  buttonVariants({ variant: 'ghost', size: 'lg' }),
                  'w-full justify-start gap-4 rounded-xl px-4 py-6 transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary font-bold shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <HugeiconsIcon icon={link.icon} size={24} />
              <span className="text-base">{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto border-t pt-6">
        <CurrentUserAvatar />
      </div>
    </div>
  );
};

export default LeftSidebar;
