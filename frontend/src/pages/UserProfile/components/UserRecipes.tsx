import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';
import { SEARCH_PARAMS } from '@/config/searchParams';

import type { Recipe } from '@/types/recipes.types';
import type { PaginationResponse } from '@/types/paginationResponse.type';

import useSearchParams from '@/hooks/useSearchParams';

import BlockUI from '@/components/common/ui-states/BlockUI';
import PaginationBar from '@/components/common/PaginationBar';
import RecipeCard from '@/components/recipes/RecipeCard';
import H2 from '@/components/ui/typography/H2';

type UserRecipesProps = {
  userId: string;
};

const UserRecipes = ({ userId }: UserRecipesProps) => {
  const { getSearchParam } = useSearchParams();

  const {
    data: recipes,
    isLoading,
    isRefetching,
    isError,
  } = useQuery<PaginationResponse<Recipe>>({
    queryKey: [
      API_ENDPOINTS.USER_RECIPES(userId),
      {
        page: getSearchParam(SEARCH_PARAMS.PAGE) || '1',
        pageSize: '12',
      },
    ],
    enabled: !!userId,
  });

  return (
    <div className="flex flex-col gap-4">
      <H2>Recipes ({recipes?.total || 0})</H2>

      <BlockUI
        isLoading={isLoading}
        isRefetching={isRefetching}
        isError={isError}
        isEmpty={!recipes || recipes.data.length === 0}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {recipes?.data.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </BlockUI>

      {recipes && (
        <PaginationBar
          currentPage={recipes.page}
          pageSize={recipes.pageSize}
          totalItems={recipes.total}
        />
      )}
    </div>
  );
};

export default UserRecipes;
