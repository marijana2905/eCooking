import { useEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit01Icon } from '@hugeicons/core-free-icons';

import type { User } from '@/types/auth.types';

import { useAuthActions } from '@/stores/auth.store';

import { useUpdateAvatarMutation } from '@/mutations/users/useUpdateAvatarMutation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LoadingSwap } from '@/components/ui/loading-swap';

type ProfileHeaderProps = {
  user: User;
  isOwnProfile: boolean;
  onEditProfile: () => void;
};

const ProfileHeader = ({
  user,
  isOwnProfile,
  onEditProfile,
}: ProfileHeaderProps) => {
  const { setUser } = useAuthActions();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { mutate: updateAvatar, isPending: isAvatarSaving } =
    useUpdateAvatarMutation();

  // Cleanup blob URL on unmount or change
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (avatarPreview) URL.revokeObjectURL(avatarPreview);

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleAvatarSave = () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append('image', avatarFile);
    updateAvatar(formData, {
      onSuccess: (updatedUser) => {
        setUser(updatedUser);
        setAvatarFile(null);
        if (avatarPreview) URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
      },
    });
  };

  const handleAvatarCancel = () => {
    setAvatarFile(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
  };

  const displayedAvatarUrl = avatarPreview ?? user.avatarUrl ?? undefined;

  return (
    <div className="flex items-start gap-5">
      {/* Avatar section */}
      <div className="relative shrink-0">
        <Avatar className="size-20">
          <AvatarImage src={displayedAvatarUrl} />
          <AvatarFallback className="text-xl">
            {user.firstName[0]}
            {user.lastName[0]}
          </AvatarFallback>
        </Avatar>

        {isOwnProfile && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 absolute -right-1 -bottom-1 flex size-7 cursor-pointer items-center justify-center rounded-full shadow-sm transition-colors"
            >
              <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
            </button>
          </>
        )}
      </div>

      {/* Info & Actions */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">{user.fullName}</h1>
            <span className="text-muted-foreground">@{user.username}</span>
          </div>
          {isOwnProfile && (
            <Button variant="outline" size="sm" onClick={onEditProfile}>
              <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
              Edit Profile
            </Button>
          )}
        </div>

        {user.bio && (
          <p className="text-muted-foreground mt-1 text-sm">{user.bio}</p>
        )}

        {/* Avatar save/cancel buttons */}
        {isOwnProfile && avatarFile && (
          <div className="mt-2 flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleAvatarSave}
              disabled={isAvatarSaving}
            >
              <LoadingSwap isLoading={isAvatarSaving}>Save Avatar</LoadingSwap>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAvatarCancel}
              disabled={isAvatarSaving}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
