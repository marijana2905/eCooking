import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from '../schemas/recipe.schema';

@Injectable()
export class CreateRecipeQuery {
  constructor(@InjectModel(Recipe.name) private model: Model<RecipeDocument>) {}

  async execute(data: any) {
    const newRecipe = new this.model(data);
    const saved = await newRecipe.save();
    return saved.toObject();
  }
}
