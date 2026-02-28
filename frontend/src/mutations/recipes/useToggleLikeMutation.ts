import { useQueryClient } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBaseMutation } from '../useBaseMutation';

type ToggleLikeResponse = {
  liked: boolean;
  likesCount: number;
};

export const useToggleLikeMutation = (recipeId: string) => {
  const queryClient = useQueryClient();

  return useBaseMutation<ToggleLikeResponse, Error, void>(
    { path: API_ENDPOINTS.RECIPE_LIKE(recipeId), method: 'PATCH' },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.RECIPES] });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.RECIPE_DETAILS(recipeId)],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.LIKED_RECIPES],
        });
      },
    },
  );
};
