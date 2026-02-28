import type { User } from '@/types/auth.types';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuthActions } from '@/stores/auth.store';

import { useUpdateProfileMutation } from '@/mutations/users/useUpdateProfileMutation';

import {
  editProfileSchema,
  type EditProfileSchemaType,
} from '../schema/editProfile.schema';

import { FieldGroup } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { LoadingSwap } from '@/components/ui/loading-swap';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import FormInput from '@/components/form/FormInput';
import FormTextarea from '@/components/form/FormTextarea';

type EditProfileDialogProps = {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EditProfileDialog = ({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) => {
  const { setUser } = useAuthActions();
  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();

  const form = useForm<EditProfileSchemaType>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio ?? '',
    },
  });

  const onSubmit = (data: EditProfileSchemaType) => {
    updateProfile(data, {
      onSuccess: (updatedUser) => {
        setUser(updatedUser);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            <FieldGroup>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  control={form.control}
                  name="firstName"
                  label="First Name"
                  placeholder="First name"
                />
                <FormInput
                  control={form.control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Last name"
                />
              </div>

              <FormTextarea
                control={form.control}
                name="bio"
                label="Bio"
                placeholder="Write a short bio…"
                rows={3}
              />
            </FieldGroup>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              <LoadingSwap isLoading={isPending}>Save Changes</LoadingSwap>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
