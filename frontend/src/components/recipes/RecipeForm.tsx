import { useState } from 'react';
import { useFieldArray, useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  Cancel01Icon,
  ImageUploadIcon,
} from '@hugeicons/core-free-icons';

import { API_ENDPOINTS } from '@/config/endpoints';

import { recipeSchema, type RecipeSchemaType } from './schema/recipe.schema';

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSwap } from '@/components/ui/loading-swap';

import FormInput from '@/components/form/FormInput';
import FormTextarea from '@/components/form/FormTextarea';
import FormComboboxMulti from '@/components/form/FormComboboxMulti';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

type RecipeFormProps = {
  defaultValues?: Partial<RecipeSchemaType>;
  defaultImageUrl?: string | null;
  onSubmit: (data: RecipeSchemaType, image?: File) => void;
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
};

const RecipeForm = ({
  defaultValues,
  defaultImageUrl,
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
}: RecipeFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultImageUrl ?? null,
  );
  const [tagInput, setTagInput] = useState('');

  const form = useForm<RecipeSchemaType>({
    resolver: zodResolver(recipeSchema) as Resolver<RecipeSchemaType>,
    defaultValues: {
      title: '',
      description: '',
      ingredients: [''],
      instructions: [''],
      categories: [],
      prepTime: undefined as unknown as number,
      tags: [],
      ...defaultValues,
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    // @ts-expect-error - react-hook-form string array workaround
    name: 'ingredients',
  });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control: form.control,
    // @ts-expect-error - react-hook-form string array workaround
    name: 'instructions',
  });

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: [API_ENDPOINTS.CATEGORIES],
  });

  const tags = form.watch('tags') ?? [];

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      form.setValue('tags', [...tags, trimmed]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    form.setValue(
      'tags',
      tags.filter((t) => t !== tag),
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (data: RecipeSchemaType) => {
    onSubmit(data, imageFile ?? undefined);
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <FieldGroup>
        <FormInput
          control={form.control}
          name="title"
          label="Title"
          placeholder="e.g. Chocolate Cake"
        />

        <FormTextarea
          control={form.control}
          name="description"
          label="Description"
          placeholder="A short description of the recipe..."
          maxLength={500}
        />

        <FormInput
          control={form.control}
          name="prepTime"
          label="Prep Time (minutes)"
          type="number"
          min={1}
          step={1}
          placeholder="e.g. 30"
        />

        {/* Categories */}
        <FormComboboxMulti
          control={form.control}
          name="categories"
          label="Categories"
          items={categories}
          getValue={(item) => item}
          getSearchText={(item) => item}
          renderItem={(item) => item}
          renderChip={(value) => value}
          placeholder="Select categories..."
        />

        {/* Ingredients */}
        <Field>
          <FieldLabel>Ingredients</FieldLabel>
          <div className="flex flex-col gap-2">
            {ingredientFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <InputGroup>
                  <InputGroupInput
                    {...form.register(`ingredients.${index}`)}
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  {ingredientFields.length > 1 && (
                    <InputGroupAddon align="inline-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeIngredient(index)}
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={16} />
                      </Button>
                    </InputGroupAddon>
                  )}
                </InputGroup>
              </div>
            ))}
            {form.formState.errors.ingredients?.message && (
              <p className="text-destructive text-sm">
                {form.formState.errors.ingredients.message}
              </p>
            )}
          </div>
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={() => appendIngredient('' as never)}
            >
              <HugeiconsIcon icon={Add01Icon} size={16} />
              Add Ingredient
            </Button>
          </div>
        </Field>

        {/* Instructions */}
        <Field>
          <FieldLabel>Instructions</FieldLabel>
          <div className="flex flex-col gap-2">
            {instructionFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <span className="text-muted-foreground">{index + 1}.</span>
                <InputGroup>
                  <InputGroupInput
                    {...form.register(`instructions.${index}`)}
                    placeholder={`Step ${index + 1}`}
                  />
                  {instructionFields.length > 1 && (
                    <InputGroupAddon align="inline-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeInstruction(index)}
                      >
                        <HugeiconsIcon icon={Cancel01Icon} />
                      </Button>
                    </InputGroupAddon>
                  )}
                </InputGroup>
              </div>
            ))}
            {form.formState.errors.instructions?.message && (
              <p className="text-destructive text-sm">
                {form.formState.errors.instructions.message}
              </p>
            )}
          </div>
          <div className="w-fit">
            <Button
              type="button"
              variant="outline"
              className="w-fit"
              onClick={() => appendInstruction('' as never)}
            >
              <HugeiconsIcon icon={Add01Icon} />
              Add Step
            </Button>
          </div>
        </Field>

        {/* Tags */}
        <Field>
          <FieldLabel>Tags</FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={handleAddTag}>
              Add
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  className="cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                >
                  #{tag}
                  <HugeiconsIcon icon={Cancel01Icon} />
                </Badge>
              ))}
            </div>
          )}
        </Field>

        {/* Image upload */}
        <Field>
          <FieldLabel>Image</FieldLabel>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <div className="relative h-32 w-48 overflow-hidden rounded-lg">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  className="bg-background/80 absolute top-1 right-1 rounded-full p-1"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={14}
                    className="text-foreground"
                  />
                </button>
              </div>
            ) : (
              <label className="bg-muted hover:bg-muted/80 flex h-32 w-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors">
                <HugeiconsIcon
                  icon={ImageUploadIcon}
                  size={24}
                  className="text-muted-foreground"
                />
                <span className="text-muted-foreground text-xs">
                  Upload Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </Field>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            <LoadingSwap isLoading={isPending}>{submitLabel}</LoadingSwap>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default RecipeForm;
