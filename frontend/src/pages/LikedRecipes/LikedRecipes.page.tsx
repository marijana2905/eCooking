import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';
import { SEARCH_PARAMS } from '@/config/searchParams';

import useSearchParams from '@/hooks/useSearchParams';

import type { PaginationResponse } from '@/types/paginationResponse.type';
import type { Recipe } from '@/types/recipes.types';

import H1 from '@/components/ui/typography/H1';
import BlockUI from '@/components/common/ui-states/BlockUI';
import PaginationBar from '@/components/common/PaginationBar';
import RecipeCard from '@/components/recipes/RecipeCard';

const LikedRecipesPage = () => {
  const { getSearchParam } = useSearchParams();

  const { data, isLoading, isRefetching, isError } = useQuery<
    PaginationResponse<Recipe>
  >({
    queryKey: [
      API_ENDPOINTS.LIKED_RECIPES,
      {
        page: getSearchParam(SEARCH_PARAMS.PAGE) || '1',
        pageSize: '12',
      },
    ],
  });

  return (
    <div className="flex h-full flex-col gap-4 space-y-4">
      <H1>Liked Recipes ({data?.total || 0})</H1>

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

export default LikedRecipesPage;
