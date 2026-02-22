import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from '../schemas/recipe.schema';

@Injectable()
export class DeleteRecipeQuery {
  constructor(@InjectModel(Recipe.name) private model: Model<RecipeDocument>) {}

  async execute(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    return deleted ? deleted.toObject() : null;
  }
}
