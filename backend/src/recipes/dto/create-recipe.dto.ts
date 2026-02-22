import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsInt()
  @Min(1)
  prepTime: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
