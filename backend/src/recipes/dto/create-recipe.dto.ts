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
import { Transform } from 'class-transformer';
import { RecipeCategory } from '../schemas/recipe.schema';

const toArray = ({ value }: { value: unknown }) =>
  Array.isArray(value) ? value : value != null ? [value] : [];

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(toArray)
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  ingredients: string[];

  @Transform(toArray)
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  instructions: string[];

  @Transform(toArray)
  @IsArray()
  @IsEnum(RecipeCategory, { each: true })
  categories: RecipeCategory[];

  // prepTime in minutes (convert to number in service layer)
  @IsString()
  prepTime: string;

  @IsOptional()
  @Transform(toArray)
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
