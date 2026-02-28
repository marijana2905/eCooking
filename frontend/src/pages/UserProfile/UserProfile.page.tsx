import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { User } from '@/types/auth.types';

import { useAuthUser } from '@/stores/auth.store';

import BlockUI from '@/components/common/ui-states/BlockUI';
import { Separator } from '@/components/ui/separator';
import BackButtonLink from '@/components/common/BackButtonLink';

import ProfileHeader from './components/ProfileHeader';
import EditProfileDialog from './components/EditProfileDialog';
import UserRecipes from './components/UserRecipes';

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = useAuthUser();

  const isOwnProfile = currentUser?.id === id;

  const [editOpen, setEditOpen] = useState(false);

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery<User>({
    queryKey: [API_ENDPOINTS.USER_PROFILE(id!)],
    enabled: !!id,
  });

  return (
    <div className="flex h-full flex-col gap-4">
      <BackButtonLink />

      <BlockUI
        isLoading={isUserLoading}
        isError={isUserError}
        className="flex-1"
      >
        {user && (
          <div className="flex flex-col gap-6">
            <ProfileHeader
              user={user}
              isOwnProfile={isOwnProfile}
              onEditProfile={() => setEditOpen(true)}
            />

            <Separator />

            <UserRecipes userId={id!} />

            {isOwnProfile && (
              <EditProfileDialog
                user={user}
                open={editOpen}
                onOpenChange={setEditOpen}
              />
            )}
          </div>
        )}
      </BlockUI>
    </div>
  );
};

export default UserProfilePage;
