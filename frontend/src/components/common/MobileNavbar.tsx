import { Link, NavLink } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  MoreHorizontalIcon,
  UserIcon,
  Add01Icon,
  LibraryIcon,
  FavouriteIcon,
} from '@hugeicons/core-free-icons';

import { cn } from '@/lib/utils';
import { useAuthUser } from '@/stores/auth.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ThemeDropdownMenuItem } from './ThemeToggle';
import LogoutDropdownItem from './LogoutDropdownItem';

const MobileNavbar = () => {
  const user = useAuthUser();

  return (
    <nav className="bg-background/80 fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur-lg md:hidden">
      <ul className="flex h-16 w-full items-center justify-around">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-4 py-2 text-[10px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )
            }
          >
            <HugeiconsIcon icon={LibraryIcon} size={22} />
            <span>Recipes</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/recipes/create"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-4 py-2 text-[10px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )
            }
          >
            <HugeiconsIcon icon={Add01Icon} size={22} />
            <span>Add</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/liked"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-4 py-2 text-[10px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )
            }
          >
            <HugeiconsIcon icon={FavouriteIcon} size={22} />
            <span>Liked</span>
          </NavLink>
        </li>

        {user && (
          <li className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-muted-foreground flex flex-col items-center gap-1 px-4 py-2 text-[10px] outline-none">
                <HugeiconsIcon icon={MoreHorizontalIcon} size={22} />
                <span>More</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mb-4 w-52 p-2">
                <DropdownMenuItem>
                  <Link
                    to={`/users/${user.username}`}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <HugeiconsIcon icon={UserIcon} size={18} /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <ThemeDropdownMenuItem />
                <DropdownMenuSeparator />
                <LogoutDropdownItem />
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default MobileNavbar;
