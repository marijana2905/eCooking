import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { User } from '@/types/auth.types';
import type { Recipe } from '@/types/recipes.types';
import type { PaginationResponse } from '@/types/paginationResponse.type';

import { SEARCH_PARAMS } from '@/config/searchParams';
import useSearchParams from '@/hooks/useSearchParams';

import BlockUI from '@/components/common/ui-states/BlockUI';
import PaginationBar from '@/components/common/PaginationBar';
import RecipeCard from '@/components/recipes/RecipeCard';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import BackButtonLink from '@/components/common/BackButtonLink';
import H2 from '@/components/ui/typography/H2';

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { getSearchParam } = useSearchParams();

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery<User>({
    queryKey: [API_ENDPOINTS.USER_PROFILE(id!)],
    enabled: !!id,
  });

  const {
    data: recipes,
    isLoading: isRecipesLoading,
    isRefetching,
    isError: isRecipesError,
  } = useQuery<PaginationResponse<Recipe>>({
    queryKey: [
      API_ENDPOINTS.USER_RECIPES(id!),
      {
        page: getSearchParam(SEARCH_PARAMS.PAGE) || '1',
        pageSize: '12',
      },
    ],
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
            {/* Profile header */}
            <div className="flex items-center gap-4">
              <Avatar className="size-20">
                <AvatarImage src={user.avatarUrl ?? undefined} />
                <AvatarFallback className="text-xl">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">{user.fullName}</h1>
                <span className="text-muted-foreground">@{user.username}</span>
                {user.bio && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* User's info section */}
            <div className="flex flex-col gap-4">
              <H2>Recipes</H2>

              <BlockUI
                isLoading={isRecipesLoading}
                isRefetching={isRefetching}
                isError={isRecipesError}
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
          </div>
        )}
      </BlockUI>
    </div>
  );
};

export default UserProfilePage;
