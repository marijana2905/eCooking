import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar02Icon,
  Clock01Icon,
  FavouriteIcon,
} from '@hugeicons/core-free-icons';

import { formatDate } from '@/lib/utils';

type RecipeMetaChipsProps = {
  prepTime: number;
  createdAt: string;
  numOfLikes: number;
};

const RecipeMetaChips = ({
  prepTime,
  createdAt,
  numOfLikes,
}: RecipeMetaChipsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="bg-muted flex items-center gap-2 rounded-lg px-3 py-1.5">
        <HugeiconsIcon icon={Clock01Icon} size={16} className="text-primary" />
        <span className="text-sm font-medium">{prepTime} min</span>
      </div>
      <div className="bg-muted flex items-center gap-2 rounded-lg px-3 py-1.5">
        <HugeiconsIcon
          icon={Calendar02Icon}
          size={16}
          className="text-primary"
        />
        <span className="text-sm font-medium">{formatDate(createdAt)}</span>
      </div>
      <div className="bg-muted flex items-center gap-2 rounded-lg px-3 py-1.5">
        <HugeiconsIcon
          icon={FavouriteIcon}
          size={16}
          className="text-primary"
          fill="currentColor"
        />
        <span className="text-sm font-medium">
          {numOfLikes} {numOfLikes === 1 ? 'like' : 'likes'}
        </span>
      </div>
    </div>
  );
};

export default RecipeMetaChips;
