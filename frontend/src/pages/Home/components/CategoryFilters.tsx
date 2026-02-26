import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const CategoryFilters = () => {
  const { data, isLoading } = useQuery<string[]>({
    queryKey: [API_ENDPOINTS.CATEGORIES],
  });

  if (isLoading || !data) {
    return (
      <div className="no-scrollbar flex items-center gap-4 overflow-x-auto">
        {[...Array(18)].map((_, index) => (
          <Skeleton key={index} className="h-8 w-24 rounded" />
        ))}
      </div>
    );
  }

  return (
    <ToggleGroup
      multiple
      className="no-scrollbar w-full overflow-x-auto"
      variant="outline"
      spacing={2}
    >
      {data?.map((category) => (
        <ToggleGroupItem key={category} value={category}>
          {category}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default CategoryFilters;
