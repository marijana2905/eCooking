import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from '../schemas/recipe.schema';

@Injectable()
export class UpdateRecipeQuery {
  constructor(@InjectModel(Recipe.name) private model: Model<RecipeDocument>) {}

  async execute(id: string, data: any) {
    // Ovde koristimo lean() da izbegnemo buffere
    return await this.model
      .findByIdAndUpdate(
        id,
        { $set: data }, // MongoDB operator za izmenu
        { new: true, runValidators: true },
      )
      .populate('author', 'firstName lastName email')
      .lean()
      .exec();
  }
}
