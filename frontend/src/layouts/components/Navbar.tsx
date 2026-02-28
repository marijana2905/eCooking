import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  FavouriteIcon,
  Note01Icon,
} from '@hugeicons/core-free-icons';

import { APP_ROUTES } from '@/config/appRoutes';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

import CurrentUserAvatar from '@/components/common/CurrentUserAvatar';
import Logo from '@/components/common/Logo';
import RecipeFormDialog from '@/components/recipes/RecipeFormDialog';

const Navbar = () => {
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);

  return (
    <>
      <header className="bg-background/70 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
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
                <NavigationMenuLink onClick={() => setIsAddRecipeOpen(true)}>
                  <HugeiconsIcon icon={Add01Icon} />
                  Add Recipe
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link to={APP_ROUTES.LIKED_RECIPES} />}
                >
                  <HugeiconsIcon icon={FavouriteIcon} />
                  Liked
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <CurrentUserAvatar />
        </nav>
      </header>

      <RecipeFormDialog
        mode="create"
        open={isAddRecipeOpen}
        onOpenChange={setIsAddRecipeOpen}
      />
    </>
  );
};

export default Navbar;
