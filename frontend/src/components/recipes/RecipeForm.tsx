import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
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

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
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

  const ingredients = form.watch('ingredients');
  const instructions = form.watch('instructions');

  const appendIngredient = () =>
    form.setValue('ingredients', [...ingredients, ''], {
      shouldValidate: form.formState.isSubmitted,
    });
  const removeIngredient = (index: number) =>
    form.setValue(
      'ingredients',
      ingredients.filter((_, i) => i !== index),
      { shouldValidate: form.formState.isSubmitted },
    );

  const appendInstruction = () =>
    form.setValue('instructions', [...instructions, ''], {
      shouldValidate: form.formState.isSubmitted,
    });
  const removeInstruction = (index: number) =>
    form.setValue(
      'instructions',
      instructions.filter((_, i) => i !== index),
      { shouldValidate: form.formState.isSubmitted },
    );

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
            {ingredients.map((_, index) => (
              <div key={index} className="flex flex-col gap-1">
                <InputGroup>
                  <InputGroupInput
                    {...form.register(`ingredients.${index}`, {
                      onChange: () => {
                        if (form.formState.isSubmitted)
                          form.trigger('ingredients');
                      },
                    })}
                    placeholder={`Ingredient ${index + 1}`}
                    aria-invalid={!!form.formState.errors.ingredients?.[index]}
                  />
                  {ingredients.length > 1 && (
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
                {form.formState.errors.ingredients?.[index]?.message && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.ingredients[index].message}
                  </p>
                )}
              </div>
            ))}
          </div>
          <FieldError
            errors={
              form.formState.errors.ingredients?.root
                ? [form.formState.errors.ingredients.root]
                : form.formState.errors.ingredients?.message
                  ? [{ message: form.formState.errors.ingredients.message }]
                  : undefined
            }
          />
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={() => appendIngredient()}
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
            {instructions.map((_, index) => (
              <div key={index} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{index + 1}.</span>
                  <InputGroup>
                    <InputGroupInput
                      {...form.register(`instructions.${index}`, {
                        onChange: () => {
                          if (form.formState.isSubmitted)
                            form.trigger('instructions');
                        },
                      })}
                      placeholder={`Step ${index + 1}`}
                      aria-invalid={
                        !!form.formState.errors.instructions?.[index]
                      }
                    />
                    {instructions.length > 1 && (
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
                {form.formState.errors.instructions?.[index]?.message && (
                  <p className="text-destructive pl-6 text-sm">
                    {form.formState.errors.instructions[index].message}
                  </p>
                )}
              </div>
            ))}
          </div>
          <FieldError
            errors={
              form.formState.errors.instructions?.root
                ? [form.formState.errors.instructions.root]
                : form.formState.errors.instructions?.message
                  ? [{ message: form.formState.errors.instructions.message }]
                  : undefined
            }
          />
          <div className="w-fit">
            <Button
              type="button"
              variant="outline"
              className="w-fit"
              onClick={() => appendInstruction()}
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
