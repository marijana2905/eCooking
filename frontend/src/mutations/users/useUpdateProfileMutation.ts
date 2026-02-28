import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { User } from '@/types/auth.types';

import { useBaseMutation } from '../useBaseMutation';

type UpdateProfileVariables = {
  firstName?: string;
  lastName?: string;
  bio?: string;
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useBaseMutation<User, Error, UpdateProfileVariables>(
    { path: API_ENDPOINTS.UPDATE_ME, method: 'PATCH' },
    {
      onSuccess: (user) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.USER_PROFILE(user.id)],
        });
        toast.success('Profile updated successfully!');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
