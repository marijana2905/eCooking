import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { Recipe } from '@/types/recipes.types';

import { useBaseMutation } from '../useBaseMutation';

export const useDeleteRecipeMutation = (recipeId: string) => {
  const queryClient = useQueryClient();

  return useBaseMutation<Recipe, Error, void>(
    { path: API_ENDPOINTS.RECIPE_DETAILS(recipeId), method: 'DELETE' },
    {
      onSuccess: (recipe) => {
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.RECIPES] });
        queryClient.removeQueries({
          queryKey: [API_ENDPOINTS.RECIPE_DETAILS(recipe.id)],
        });

        toast.success('Recipe deleted successfully!');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
