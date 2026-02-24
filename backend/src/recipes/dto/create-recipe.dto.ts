import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RecipeCategory } from '../schemas/recipe.schema';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  ingredients: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  instructions: string[];

  @IsArray()
  @IsEnum(RecipeCategory, { each: true })
  categories: RecipeCategory[];

  // prepTime in minutes (convert to number in service layer)
  @IsString()
  prepTime: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
