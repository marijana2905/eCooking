import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from '../schemas/recipe.schema';

@Injectable()
export class FindRecipeByIdQuery {
  constructor(@InjectModel(Recipe.name) private model: Model<RecipeDocument>) {}

  async execute(id: string) {
    return await this.model
      .findById(id)
      .populate('author', 'firstName lastName email')
      .exec();
  }
}
