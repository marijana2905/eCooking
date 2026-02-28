import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBaseMutation } from '../useBaseMutation';

export const useDeleteRecipeMutation = (recipeId: string) => {
  const queryClient = useQueryClient();

  return useBaseMutation<void, Error, void>(
    { path: API_ENDPOINTS.RECIPE_DETAILS(recipeId), method: 'DELETE' },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.RECIPES] });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.MY_RECIPES],
        });
        toast.success('Recipe deleted successfully!');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
