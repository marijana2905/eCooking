import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';
import { SEARCH_PARAMS } from '@/config/searchParams';

import useSearchParams from '@/hooks/useSearchParams';

import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const CategoryFilters = () => {
  const { getSearchParam, setSearchParam, removeSearchParam } =
    useSearchParams();

  const activeCategory = getSearchParam(SEARCH_PARAMS.CATEGORY) || '';

  const { data, isLoading } = useQuery<string[]>({
    queryKey: [API_ENDPOINTS.CATEGORIES],
  });

  const handleCategoryChange = (value: string[]) => {
    if (value.length > 0) setSearchParam(SEARCH_PARAMS.CATEGORY, value[0]);
    else removeSearchParam(SEARCH_PARAMS.CATEGORY);

    removeSearchParam(SEARCH_PARAMS.PAGE);
  };

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
      value={[activeCategory]}
      onValueChange={handleCategoryChange}
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
