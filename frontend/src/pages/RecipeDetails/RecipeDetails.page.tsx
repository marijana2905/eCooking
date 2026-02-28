import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar02Icon,
  CheckmarkCircle03Icon,
  Clock01Icon,
  Delete02Icon,
  FavouriteIcon,
  PencilEdit01Icon,
} from '@hugeicons/core-free-icons';

import { API_ENDPOINTS } from '@/config/endpoints';
import { APP_ROUTES } from '@/config/appRoutes';
import { cn, formatDate } from '@/lib/utils';

import { useAuthUser } from '@/stores/auth.store';

import type { Recipe } from '@/types/recipes.types';

import { useTheme } from '@/hooks/useTheme';

import { useToggleLikeMutation } from '@/mutations/recipes/useToggleLikeMutation';
import { useDeleteRecipeMutation } from '@/mutations/recipes/useDeleteRecipeMutation';

import BlockUI from '@/components/common/ui-states/BlockUI';
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog';
import RecipeFormDialog from '@/components/recipes/RecipeFormDialog';
import BackButtonLink from '@/components/common/BackButtonLink';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RecipeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthUser();
  const { theme } = useTheme();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

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
            {/* Top section: Info (left) + Image (right) */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[7fr_3fr]">
              {/* Left: Basic info */}
              <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-sm">
                {/* Title */}
                <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                  {recipe.title}
                </h1>

                {/* Description */}
                <p className="text-muted-foreground text-base leading-relaxed">
                  {recipe.description}
                </p>

                {/* Author */}
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
                    <span className="text-sm font-medium underline-offset-4 group-hover:underline">
                      {recipe.author.fullName}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      @{recipe.author.username}
                    </span>
                  </div>
                </Link>

                {/* Meta chips */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-muted flex items-center gap-2 rounded-lg px-3 py-1.5">
                    <HugeiconsIcon
                      icon={Clock01Icon}
                      size={16}
                      className="text-primary"
                    />
                    <span className="text-sm font-medium">
                      {recipe.prepTime} min
                    </span>
                  </div>
                  <div className="bg-muted flex items-center gap-2 rounded-lg px-3 py-1.5">
                    <HugeiconsIcon
                      icon={Calendar02Icon}
                      size={16}
                      className="text-primary"
                    />
                    <span className="text-sm font-medium">
                      {formatDate(recipe.createdAt)}
                    </span>
                  </div>
                  <div className="bg-muted flex items-center gap-2 rounded-lg px-3 py-1.5">
                    <HugeiconsIcon
                      icon={FavouriteIcon}
                      size={16}
                      className="text-primary"
                      fill="currentColor"
                    />
                    <span className="text-sm font-medium">
                      {recipe.numOfLikes}{' '}
                      {recipe.numOfLikes === 1 ? 'like' : 'likes'}
                    </span>
                  </div>
                </div>

                {/* Categories & Tags */}
                <div className="flex flex-col gap-2">
                  {recipe.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {recipe.categories.map((cat) => (
                        <Badge key={cat}>{cat}</Badge>
                      ))}
                    </div>
                  )}
                  {recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
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
                    {recipe.isLiked ? 'Liked' : 'Like'}
                  </Button>

                  {isOwner && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setEditOpen(true)}
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

              {/* Right: Image */}
              <div className="order-first lg:order-last">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={recipe.imageUrl || placeholderImage}
                    alt={recipe.title}
                    className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Ingredients & Instructions side-by-side on large screens */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Ingredients Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Ingredients
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <div
                      key={idx}
                      className="bg-muted/50 flex items-start gap-3 rounded-lg px-3 py-2.5"
                    >
                      <span className="bg-primary/10 text-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs">
                        <HugeiconsIcon icon={CheckmarkCircle03Icon} />
                      </span>
                      <span className="text-sm leading-relaxed">
                        {ingredient}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Instructions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {recipe.instructions.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <span className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        {idx + 1}
                      </span>
                      <p className="pt-1 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
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

      {isOwner && (
        <RecipeFormDialog
          mode="edit"
          recipeId={id!}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </div>
  );
};

export default RecipeDetailsPage;
