import { useNavigate } from 'react-router-dom';

import { APP_ROUTES } from '@/config/appRoutes';

import { useCreateRecipeMutation } from '@/mutations/recipes/useCreateRecipeMutation';

import type { RecipeSchemaType } from './schema/recipe.schema';

import H1 from '@/components/ui/typography/H1';
import BackButtonLink from '@/components/common/BackButtonLink';

import RecipeForm from './components/RecipeForm';

const CreateRecipePage = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateRecipeMutation();

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
      onSuccess: (recipe) => {
        navigate(APP_ROUTES.RECIPE_DETAILS(recipe.id));
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <BackButtonLink />

      <div className="mx-auto w-full max-w-2xl space-y-4">
        <H1>Create Recipe</H1>
        <RecipeForm
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel="Create"
        />
      </div>
    </div>
  );
};

export default CreateRecipePage;
