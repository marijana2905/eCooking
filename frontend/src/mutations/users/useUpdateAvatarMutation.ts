import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { User } from '@/types/auth.types';

import { useBaseMutation } from '../useBaseMutation';

export const useUpdateAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useBaseMutation<User, Error, FormData>(
    { path: API_ENDPOINTS.USER_AVATAR, method: 'PUT' },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.MY_RECIPES],
        });
        toast.success('Avatar updated successfully!');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
