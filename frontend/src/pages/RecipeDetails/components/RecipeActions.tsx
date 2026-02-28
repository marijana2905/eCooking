import { HugeiconsIcon } from '@hugeicons/react';
import {
  Delete02Icon,
  FavouriteIcon,
  PencilEdit01Icon,
} from '@hugeicons/core-free-icons';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

type RecipeActionsProps = {
  isLiked: boolean;
  isOwner: boolean;
  onToggleLike: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const RecipeActions = ({
  isLiked,
  isOwner,
  onToggleLike,
  onEdit,
  onDelete,
}: RecipeActionsProps) => {
  return (
    <div className="mt-auto ml-auto flex items-center gap-2">
      <Button
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          onToggleLike();
        }}
      >
        <HugeiconsIcon
          icon={FavouriteIcon}
          fill={isLiked ? 'currentColor' : 'none'}
          className={cn(isLiked && 'text-primary')}
        />
        {isLiked ? 'Liked' : 'Like'}
      </Button>

      {isOwner && (
        <>
          <Button variant="outline" onClick={onEdit}>
            <HugeiconsIcon icon={PencilEdit01Icon} />
            Edit
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <HugeiconsIcon icon={Delete02Icon} />
            Delete
          </Button>
        </>
      )}
    </div>
  );
};

export default RecipeActions;
