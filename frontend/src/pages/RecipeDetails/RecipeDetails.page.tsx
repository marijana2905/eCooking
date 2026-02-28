import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Clock01Icon,
  Delete02Icon,
  FavouriteIcon,
  PencilEdit01Icon,
} from '@hugeicons/core-free-icons';

import { API_ENDPOINTS } from '@/config/endpoints';
import { APP_ROUTES } from '@/config/appRoutes';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

import { useAuthUser } from '@/stores/auth.store';

import type { Recipe } from '@/types/recipes.types';

import { useTheme } from '@/hooks/useTheme';

import { useToggleLikeMutation } from '@/mutations/recipes/useToggleLikeMutation';
import { useDeleteRecipeMutation } from '@/mutations/recipes/useDeleteRecipeMutation';

import BlockUI from '@/components/common/ui-states/BlockUI';
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog';
import BackButtonLink from '@/components/common/BackButtonLink';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import H1 from '@/components/ui/typography/H1';
import H2 from '@/components/ui/typography/H2';

const RecipeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthUser();
  const { theme } = useTheme();

  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    data: recipe,
    isLoading,
    isError,
  } = useQuery<Recipe>({
    queryKey: [API_ENDPOINTS.RECIPE_DETAILS(id!)],
    enabled: !!id,
  });

  const { mutate: toggleLike } = useToggleLikeMutation(id!);
  const { mutate: deleteRecipe, isPending: isDeleting } =
    useDeleteRecipeMutation(id!);

  const isOwner = currentUser?.id === recipe?.author?.id;

  const handleDelete = () => {
    deleteRecipe(undefined, {
      onSuccess: () => {
        setDeleteOpen(false);
        navigate(APP_ROUTES.HOME);
      },
    });
  };

  const placeholderImage = `/images/recipe_placeholder_${
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
  }.png`;

  return (
    <div className="flex h-full flex-col gap-4">
      <BackButtonLink />

      <BlockUI isLoading={isLoading} isError={isError} className="flex-1">
        {recipe && (
          <div className="flex flex-col gap-4">
            {/* Hero image */}
            <div className="relative aspect-video max-h-96 w-full overflow-hidden rounded-xl">
              <img
                src={recipe.imageUrl || placeholderImage}
                alt={recipe.title}
                className="size-full object-cover"
              />
            </div>

            {/* Title and actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-2">
                <H1>{recipe.title}</H1>
                <p className="text-muted-foreground">{recipe.description}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
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

                {isOwner && (
                  <>
                    <Button
                      variant="outline"
                      render={<Link to={APP_ROUTES.EDIT_RECIPE(recipe.id)} />}
                      nativeButton={false}
                    >
                      <HugeiconsIcon icon={PencilEdit01Icon} />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteOpen(true)}
                    >
                      <HugeiconsIcon icon={Delete02Icon} />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-muted-foreground flex items-center gap-2">
                <HugeiconsIcon icon={Clock01Icon} size={18} />
                <span>{recipe.prepTime} min</span>
              </div>
              <Separator orientation="vertical" className="h-5" />
              <span className="text-muted-foreground text-sm">
                {formatDate(recipe.createdAt)}
              </span>
            </div>

            {/* Categories */}
            {recipe.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recipe.categories.map((cat) => (
                  <Badge key={cat}>{cat}</Badge>
                ))}
              </div>
            )}

            {/* Tags */}
            {recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            <Separator />

            {/* Ingredients */}
            <section className="flex flex-col gap-3">
              <H2>Ingredients</H2>
              <ul className="list-inside list-disc space-y-1.5">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="text-muted-foreground">
                    <span className="text-foreground">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Separator />

            {/* Instructions */}
            <section className="flex flex-col gap-3">
              <H2>Instructions</H2>
              <ol className="list-inside list-decimal space-y-3">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="text-muted-foreground">
                    <span className="text-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <Separator />

            {/* Author */}
            <section className="flex flex-col gap-3">
              <H2>Author</H2>
              <Link
                to={APP_ROUTES.USER_PROFILE(recipe.author.id)}
                className="group flex w-fit items-center gap-3"
              >
                <Avatar className="size-10">
                  <AvatarImage src={recipe.author.avatarUrl ?? undefined} />
                  <AvatarFallback>
                    {recipe.author.firstName[0]}
                    {recipe.author.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium underline-offset-4 group-hover:underline">
                    {recipe.author.fullName}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    @{recipe.author.username}
                  </span>
                </div>
              </Link>
            </section>
          </div>
        )}
      </BlockUI>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this recipe?"
        description="This action cannot be undone. The recipe will be permanently deleted."
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default RecipeDetailsPage;
