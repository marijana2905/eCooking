import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Note01Icon } from '@hugeicons/core-free-icons';

import { APP_ROUTES } from '@/config/appRoutes';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

import CurrentUserAvatar from '@/components/common/CurrentUserAvatar';
import Logo from '@/components/common/Logo';

const Navbar = () => {
  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <Logo size={120} />

        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink render={<Link to={APP_ROUTES.HOME} />}>
                <HugeiconsIcon icon={Note01Icon} />
                Recipes
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink render={<Link to={APP_ROUTES.ADD_RECIPE} />}>
                <HugeiconsIcon icon={Add01Icon} />
                Add Recipe
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <CurrentUserAvatar />
      </nav>
    </header>
  );
};

export default Navbar;
