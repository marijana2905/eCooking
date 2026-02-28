import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { Recipe } from '@/types/recipes.types';

import { useBaseMutation } from '../useBaseMutation';

export const useUpdateRecipeMutation = (recipeId: string) => {
  const queryClient = useQueryClient();

  return useBaseMutation<Recipe, Error, FormData>(
    { path: API_ENDPOINTS.RECIPE_DETAILS(recipeId), method: 'PATCH' },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.RECIPES] });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.RECIPE_DETAILS(recipeId)],
        });
        toast.success('Recipe updated successfully!');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
