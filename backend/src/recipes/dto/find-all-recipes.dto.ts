import { IsOptional, IsEnum } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { RecipeCategory } from '../schemas/recipe.schema';

export class FindAllRecipesDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(RecipeCategory)
  category?: RecipeCategory;
}
