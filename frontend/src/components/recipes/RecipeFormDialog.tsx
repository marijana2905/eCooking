import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { Recipe } from '@/types/recipes.types';
import type { RecipeSchemaType } from './schema/recipe.schema';

import { useCreateRecipeMutation } from '@/mutations/recipes/useCreateRecipeMutation';
import { useUpdateRecipeMutation } from '@/mutations/recipes/useUpdateRecipeMutation';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';

import RecipeForm from './RecipeForm';

type RecipeFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
} & ({ mode: 'create'; recipeId?: never } | { mode: 'edit'; recipeId: string });

const buildFormData = (data: RecipeSchemaType, image?: File): FormData => {
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

  return formData;
};

const RecipeFormDialog = ({
  open,
  onOpenChange,
  mode,
  recipeId,
}: RecipeFormDialogProps) => {
  const isEdit = mode === 'edit';

  const {
    data: recipe,
    isLoading: isLoadingRecipe,
    isError,
  } = useQuery<Recipe>({
    queryKey: [API_ENDPOINTS.RECIPE_DETAILS(recipeId!)],
    enabled: isEdit && !!recipeId && open,
  });

  const createMutation = useCreateRecipeMutation();
  const updateMutation = useUpdateRecipeMutation(recipeId ?? '');

  const { mutate, isPending } = isEdit ? updateMutation : createMutation;

  const handleSubmit = (data: RecipeSchemaType, image?: File) => {
    const formData = buildFormData(data, image);

    mutate(formData, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const isReady = !isEdit || (!isLoadingRecipe && !!recipe);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Recipe' : 'Create Recipe'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update your recipe details below.'
              : 'Fill in the details to create a new recipe.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="-mx-6 max-h-[70vh]" tabIndex={-1}>
          <div className="mx-6">
            {isEdit && isLoadingRecipe && (
              <div className="flex items-center justify-center py-12">
                <Spinner />
              </div>
            )}

            {isEdit && isError && (
              <p className="text-destructive py-12 text-center text-sm">
                Failed to load recipe. Please try again.
              </p>
            )}

            {isReady && (
              <RecipeForm
                defaultValues={
                  isEdit && recipe
                    ? {
                        title: recipe.title,
                        description: recipe.description,
                        ingredients: recipe.ingredients,
                        instructions: recipe.instructions,
                        categories: recipe.categories,
                        prepTime: recipe.prepTime,
                        tags: recipe.tags,
                      }
                    : undefined
                }
                defaultImageUrl={isEdit && recipe ? recipe.imageUrl : null}
                onSubmit={handleSubmit}
                onCancel={() => onOpenChange(false)}
                isPending={isPending}
                submitLabel={isEdit ? 'Save Changes' : 'Create'}
              />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeFormDialog;
