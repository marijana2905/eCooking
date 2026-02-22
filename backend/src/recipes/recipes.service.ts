import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateRecipeQuery } from './queries/create-recipe.query';
import { FindRecipeByIdQuery } from './queries/find-recipe-by-id.query';
import { DeleteRecipeQuery } from './queries/delete-recipe.query';
import { UpdateRecipeQuery } from './queries/update-recipe.query';

@Injectable()
export class RecipesService {
  constructor(
    private readonly createQuery: CreateRecipeQuery,
    private readonly findByIdQuery: FindRecipeByIdQuery,
    private readonly deleteQuery: DeleteRecipeQuery,
    private readonly updateQuery: UpdateRecipeQuery,
  ) {}

  async create(dto: any, userId: string) {
    const recipeData = {
      ...dto,
      author: new Types.ObjectId(userId),
    };
    return this.createQuery.execute(recipeData);
  }

  async remove(recipeId: string, userId: string) {
    const recipe = await this.findByIdQuery.execute(recipeId);

    if (!recipe) {
      throw new NotFoundException('Recept nije pronađen');
    }

    if (recipe.author['_id'].toString() !== userId) {
      throw new ForbiddenException('Možete brisati samo svoje recepte!');
    }

    await this.deleteQuery.execute(recipeId);

    return {
      success: true,
      message: `Recept "${recipe.title}" je uspešno obrisan.`,
    };
  }
  async update(recipeId: string, dto: any, userId: string) {
    const recipe = await this.findByIdQuery.execute(recipeId);

    if (!recipe) {
      throw new NotFoundException('Recept nije pronađen');
    }

    if (recipe.author['_id'].toString() !== userId) {
      throw new ForbiddenException('Možete menjati samo svoje recepte!');
    }

    return await this.updateQuery.execute(recipeId, dto);
  }
}
