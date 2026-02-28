import { RecipeAuthorResponseDto } from 'src/users/schemas/dto/recipe-author-response.dto';
import { RecipeCategory } from '../schemas/recipe.schema';

export class RecipeResponseDto {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  categories: RecipeCategory[];
  prepTime: number;
  imageUrl: string;
  tags: string[];
  author: RecipeAuthorResponseDto;
  numOfLikes: number;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
