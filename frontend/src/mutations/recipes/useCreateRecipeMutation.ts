import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { Recipe } from '@/types/recipes.types';

import { useBaseMutation } from '../useBaseMutation';

export const useCreateRecipeMutation = () => {
  const queryClient = useQueryClient();

  return useBaseMutation<Recipe, Error, FormData>(
    { path: API_ENDPOINTS.RECIPES },
    {
      onSuccess: (recipe) => {
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.RECIPES] });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.USER_PROFILE(recipe.author.id)],
        });
        toast.success('Recipe created successfully!');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
