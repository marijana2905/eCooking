import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Clock01Icon, FavouriteIcon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

import { APP_ROUTES } from '@/config/appRoutes';

import type { Recipe } from '@/types/recipes.types';

import { useToggleLikeMutation } from '@/mutations/recipes/useToggleLikeMutation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  recipe: Recipe;
};

const RecipeCard = ({ recipe }: Props) => {
  const { theme } = useTheme();
  const { mutate: toggleLike } = useToggleLikeMutation(recipe.id);

  const categories = recipe.categories || [];
  const visibleCategories = categories.slice(0, 2);
  const hiddenCategories = categories.slice(2);

  return (
    <Link to={APP_ROUTES.RECIPE_DETAILS(recipe.id)}>
      <Card
        className="group flex h-full cursor-pointer flex-col transition-transform hover:-translate-y-0.5"
        size="sm"
      >
        <div className="relative -mt-4 aspect-3/2 w-full overflow-hidden rounded-t-xl">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="size-full object-cover"
            />
          ) : (
            <img
              src={`/images/recipe_placeholder_${
                theme === 'system'
                  ? window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light'
                  : theme
              }.png`}
              className="border-b"
            />
          )}

          {/* Categories Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {visibleCategories.map((category) => (
              <Badge key={category}>{category}</Badge>
            ))}
            {hiddenCategories.length > 0 && (
              <Tooltip delay={200}>
                <TooltipTrigger
                  render={
                    <Badge variant="secondary">
                      +{hiddenCategories.length}
                    </Badge>
                  }
                />
                <TooltipContent
                  side="bottom"
                  align="center"
                  className="flex flex-col gap-1"
                >
                  {hiddenCategories.map((category) => (
                    <span key={category}>{category}</span>
                  ))}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <CardHeader>
          <CardTitle className="line-clamp-1 underline-offset-4 group-hover:underline">
            {recipe.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {recipe.description}
          </CardDescription>
        </CardHeader>

        <CardFooter className="mt-auto justify-between border-t">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Clock01Icon} size={20} />
            <span>{recipe.prepTime} min</span>
          </div>

          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleLike();
            }}
          >
            <HugeiconsIcon
              icon={FavouriteIcon}
              fill={recipe.isLiked ? 'currentColor' : 'none'}
              className={cn(recipe.isLiked && 'text-primary')}
            />
            <span>{recipe.numOfLikes}</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RecipeCard;
