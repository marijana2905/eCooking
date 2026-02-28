import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useSearchParams from '@/hooks/useSearchParams';

import { SEARCH_PARAMS } from '@/config/searchParams';
import { API_ENDPOINTS } from '@/config/endpoints';

import type { PaginationResponse } from '@/types/paginationResponse.type';
import type { Recipe } from '@/types/recipes.types';

import BlockUI from '@/components/common/ui-states/BlockUI';
import SearchInput from '@/components/common/SearchInput';
import PaginationBar from '@/components/common/PaginationBar';
import RecipeCard from '@/components/recipes/RecipeCard';
import CategoryFilters from './components/CategoryFilters';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '@/config/appRoutes';

const HomePage = () => {
  const { getSearchParam, setSearchParam, removeSearchParam } =
    useSearchParams();

  const [debounceSearchTerm, setDebounceSearchTerm] = useState(
    getSearchParam(SEARCH_PARAMS.SEARCH) || '',
  );

  const { data, isLoading, isRefetching, isError } = useQuery<
    PaginationResponse<Recipe>
  >({
    queryKey: [
      API_ENDPOINTS.RECIPES,
      {
        page: getSearchParam(SEARCH_PARAMS.PAGE) || '1',
        search: debounceSearchTerm || undefined,
        category: getSearchParam(SEARCH_PARAMS.CATEGORY) || undefined,
        pageSize: '12',
      },
    ],
  });

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <SearchInput
          className="sm:w-xs"
          debounceDelay={300}
          defaultValue={getSearchParam(SEARCH_PARAMS.SEARCH) || ''}
          onValueChange={(value) => {
            if (value === '') removeSearchParam(SEARCH_PARAMS.SEARCH);
            else setSearchParam(SEARCH_PARAMS.SEARCH, value);
          }}
          onDebouncedChange={(value) => setDebounceSearchTerm(value)}
        />

        <Button
          render={<Link to={APP_ROUTES.ADD_RECIPE} />}
          nativeButton={false}
        >
          <HugeiconsIcon icon={Add01Icon} />
          Add Recipe
        </Button>
      </div>

      <CategoryFilters />

      <BlockUI
        isLoading={isLoading}
        isRefetching={isRefetching}
        isError={isError}
        isEmpty={!data || data.data.length === 0}
        className="flex-1"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data?.data.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </BlockUI>

      {data && (
        <PaginationBar
          currentPage={data.page}
          pageSize={data.pageSize}
          totalItems={data.total}
        />
      )}
    </div>
  );
};

export default HomePage;
