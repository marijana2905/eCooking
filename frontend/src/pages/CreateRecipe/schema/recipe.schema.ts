import { z } from 'zod';

export const recipeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description is too long'),
  ingredients: z
    .array(z.string().min(1, 'Ingredient cannot be empty'))
    .min(1, 'At least one ingredient is required'),
  instructions: z
    .array(z.string().min(1, 'Instruction cannot be empty'))
    .min(1, 'At least one instruction is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  prepTime: z.coerce
    .number({ message: 'Must be a number' })
    .int('Must be a whole number')
    .min(1, 'Prep time must be at least 1 minute'),
  tags: z.array(z.string()),
});

export type RecipeSchemaType = z.infer<typeof recipeSchema>;
