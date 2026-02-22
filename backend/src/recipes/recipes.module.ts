import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { Recipe, RecipeSchema } from './schemas/recipe.schema';
import { CreateRecipeQuery } from './queries/create-recipe.query';
import { FindRecipeByIdQuery } from './queries/find-recipe-by-id.query';
import { DeleteRecipeQuery } from './queries/delete-recipe.query';
import { UpdateRecipeQuery } from './queries/update-recipe.query';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
  ],
  controllers: [RecipesController],
  providers: [
    RecipesService,
    CreateRecipeQuery,
    FindRecipeByIdQuery,
    DeleteRecipeQuery,
    UpdateRecipeQuery,
  ],
})
export class RecipesModule {}
