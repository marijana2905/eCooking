import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { MoreHorizontalIcon, UserIcon } from '@hugeicons/core-free-icons';

import { useAuthUser } from '@/stores/auth.store';
import { getAvatarFallback, getUserFullName } from '@/lib/utils';

import { APP_ROUTES } from '@/config/appRoutes';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import LogoutDropdownItem from './LogoutDropdownItem';
import { ThemeDropdownMenuItem } from './ThemeToggle';

const CurrentUserAvatar = () => {
  const user = useAuthUser();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-muted dark:hover:bg-muted/50 flex min-w-0 items-center gap-2 overflow-hidden rounded-md p-2 transition-colors">
        <Avatar className="relative size-9 shrink-0">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{getAvatarFallback(user)}</AvatarFallback>
        </Avatar>

        <div className="hidden min-w-0 flex-1 flex-col text-left text-sm md:flex">
          <span className="truncate font-semibold">
            {getUserFullName(user)}
          </span>
          <span className="text-muted-foreground truncate">{`@${user.username}`}</span>
        </div>

        <HugeiconsIcon
          icon={MoreHorizontalIcon}
          className="hidden shrink-0 md:block"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem
          render={
            <Link to={APP_ROUTES.USER_PROFILE(user.id)}>
              <HugeiconsIcon icon={UserIcon} />
              Profile
            </Link>
          }
        />
        <ThemeDropdownMenuItem />
        <DropdownMenuSeparator />
        <LogoutDropdownItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrentUserAvatar;
