import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Recipe,
  RecipeDocument,
  RecipeCategory,
} from './schemas/recipe.schema';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name)
    private readonly recipeModel: Model<RecipeDocument>,
  ) {}

  async findAll(category?: RecipeCategory) {
    const query = category ? { categories: category } : {};

    return this.recipeModel
      .find(query)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const recipe = await this.recipeModel
      .findById(id)
      .populate('author', 'username');
    if (!recipe) throw new NotFoundException('Recipe not found');
    return recipe;
  }

  async create(dto: CreateRecipeDto, currentUserId: string) {
    const saved = await this.recipeModel.create({
      ...dto,
      author: new Types.ObjectId(currentUserId),
    });

    return saved.toJSON();
  }

  async update(recipeId: string, dto: UpdateRecipeDto, currentUserId: string) {
    const recipe = await this.recipeModel.findById(recipeId).select('author');

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.author.toString() !== currentUserId) {
      throw new ForbiddenException('You can only update your own recipes');
    }

    const updated = await this.recipeModel
      .findByIdAndUpdate(
        recipeId,
        { $set: dto },
        { new: true, runValidators: true },
      )
      .populate('author', 'username');

    return updated?.toJSON() ?? null;
  }

  async remove(recipeId: string, currentUserId: string) {
    const recipe = await this.recipeModel.findById(recipeId);

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.author.toString() !== currentUserId) {
      throw new ForbiddenException('You can only delete your own recipes');
    }

    const deleted = await this.recipeModel.findByIdAndDelete(recipeId);
    return deleted?.toJSON() ?? null;
  }
}
