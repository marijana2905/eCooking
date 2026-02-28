import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';
import { APP_ROUTES } from '@/config/appRoutes';

import type { Recipe } from '@/types/recipes.types';

import { useUpdateRecipeMutation } from '@/mutations/recipes/useUpdateRecipeMutation';

import type { RecipeSchemaType } from '../CreateRecipe/schema/recipe.schema';

import BlockUI from '@/components/common/ui-states/BlockUI';
import BackButtonLink from '@/components/common/BackButtonLink';

import RecipeForm from '../CreateRecipe/components/RecipeForm';
import H1 from '@/components/ui/typography/H1';

const EditRecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: recipe,
    isLoading,
    isError,
  } = useQuery<Recipe>({
    queryKey: [API_ENDPOINTS.RECIPE_DETAILS(id!)],
    enabled: !!id,
  });

  const { mutate, isPending } = useUpdateRecipeMutation(id!);

  const handleSubmit = (data: RecipeSchemaType, image?: File) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('prepTime', String(data.prepTime));

    data.ingredients.forEach((ing) => formData.append('ingredients', ing));
    data.instructions.forEach((inst) => formData.append('instructions', inst));
    data.categories.forEach((cat) => formData.append('categories', cat));
    (data.tags ?? []).forEach((tag) => formData.append('tags', tag));

    if (image) {
      formData.append('image', image);
    }

    mutate(formData, {
      onSuccess: () => {
        navigate(APP_ROUTES.RECIPE_DETAILS(id!));
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <BackButtonLink />

      <BlockUI isLoading={isLoading} isError={isError} className="flex-1">
        {recipe && (
          <div className="mx-auto w-full max-w-2xl space-y-4">
            <H1>Edit Recipe</H1>
            <RecipeForm
              defaultValues={{
                title: recipe.title,
                description: recipe.description,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                categories: recipe.categories,
                prepTime: recipe.prepTime,
                tags: recipe.tags,
              }}
              defaultImageUrl={recipe.imageUrl}
              onSubmit={handleSubmit}
              isPending={isPending}
              submitLabel="Save Changes"
            />
          </div>
        )}
      </BlockUI>
    </div>
  );
};

export default EditRecipePage;
