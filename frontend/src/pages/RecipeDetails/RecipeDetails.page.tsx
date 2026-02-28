import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';
import { APP_ROUTES } from '@/config/appRoutes';

import { useAuthUser } from '@/stores/auth.store';

import type { Recipe } from '@/types/recipes.types';

import { useToggleLikeMutation } from '@/mutations/recipes/useToggleLikeMutation';
import { useDeleteRecipeMutation } from '@/mutations/recipes/useDeleteRecipeMutation';

import BlockUI from '@/components/common/ui-states/BlockUI';
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog';
import RecipeFormDialog from '@/components/recipes/RecipeFormDialog';
import BackButtonLink from '@/components/common/BackButtonLink';
import H1 from '@/components/ui/typography/H1';

import RecipeImage from './components/RecipeImage';
import RecipeMetaChips from './components/RecipeMetaChips';
import RecipeTags from './components/RecipeTags';
import RecipeActions from './components/RecipeActions';
import RecipeIngredientsCard from './components/RecipeIngredientsCard';
import RecipeInstructionsCard from './components/RecipeInstructionsCard';
import UserDisplay from '@/components/common/UserDisplay';

const RecipeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthUser();

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

  return (
    <div className="flex h-full flex-col gap-4">
      <BackButtonLink />

      <BlockUI isLoading={isLoading} isError={isError} className="flex-1">
        {recipe && (
          <div className="flex flex-col gap-4">
            {/* Top section: Info (left) + Image (right) */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[7fr_3fr]">
              {/* Left: Basic info */}
              <div className="bg-card flex h-full flex-col gap-4 rounded-xl border p-6 shadow-sm">
                <H1>{recipe.title}</H1>

                <p className="text-muted-foreground">{recipe.description}</p>

                <UserDisplay user={recipe.author} link />

                <RecipeMetaChips
                  prepTime={recipe.prepTime}
                  createdAt={recipe.createdAt}
                  numOfLikes={recipe.numOfLikes}
                />

                <RecipeTags categories={recipe.categories} tags={recipe.tags} />

                <RecipeActions
                  isLiked={recipe.isLiked}
                  isOwner={isOwner}
                  onToggleLike={() => toggleLike()}
                  onEdit={() => setEditOpen(true)}
                  onDelete={() => setDeleteOpen(true)}
                />
              </div>

              {/* Right: Image */}
              <div className="order-first lg:order-last">
                <RecipeImage imageUrl={recipe.imageUrl} title={recipe.title} />
              </div>
            </div>

            {/* Ingredients & Instructions side-by-side on large screens */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <RecipeIngredientsCard ingredients={recipe.ingredients} />
              <RecipeInstructionsCard instructions={recipe.instructions} />
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
