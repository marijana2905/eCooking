import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CLOUDINARY_RECIPES_FOLDER } from 'src/cloudinary/constants';

import { Recipe, RecipeDocument } from './schemas/recipe.schema';

import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';

import { FindAllRecipesDto } from './dto/find-all-recipes.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeResponseDto } from './dto/recipe-response.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
@Injectable()
export class RecipesService {
  private readonly logger = new Logger(RecipesService.name);

  constructor(
    @InjectModel(Recipe.name)
    private readonly recipeModel: Model<RecipeDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(
    query: FindAllRecipesDto,
    currentUserId: string,
  ): Promise<PaginatedResponse<RecipeResponseDto>> {
    const { page = 1, pageSize = 10, search, category } = query;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.categories = category;
    }

    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.recipeModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('author')
        .exec(),
      this.recipeModel.countDocuments(filter).exec(),
    ]);

    const mappedData: RecipeResponseDto[] = data.map((recipe) => {
      const isLiked = recipe.likes.some(
        (id) => id.toString() === currentUserId,
      );

      const { likes, ...json } = recipe.toJSON() as any;

      return { ...json, isLiked, numOfLikes: likes.length };
    });

    return {
      data: mappedData,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findLikedRecipes(
    query: PaginationQueryDto,
    currentUserId: string,
  ): Promise<PaginatedResponse<RecipeResponseDto>> {
    const { page = 1, pageSize = 10 } = query;

    const filter = {
      likes: new Types.ObjectId(currentUserId),
    };

    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.recipeModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('author')
        .exec(),
      this.recipeModel.countDocuments(filter).exec(),
    ]);

    const mappedData: RecipeResponseDto[] = data.map((recipe) => {
      const { likes, ...json } = recipe.toJSON() as any;
      return { ...json, isLiked: true, numOfLikes: likes.length };
    });

    return {
      data: mappedData,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
  async findOne(id: string, currentUserId: string) {
    const recipe = await this.recipeModel.findById(id).populate('author');

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    const isLiked = recipe.likes.some((id) => id.toString() === currentUserId);
    const { likes, ...json } = recipe.toJSON() as any;

    return { ...json, isLiked, numOfLikes: likes.length };
  }

  async create(
    dto: CreateRecipeDto,
    currentUserId: string,
    image?: Express.Multer.File,
  ) {
    // Convert prepTime from string to number (in minutes)
    const prepTimeMinutes = parseInt(dto.prepTime, 10);
    if (isNaN(prepTimeMinutes) || prepTimeMinutes <= 0) {
      throw new BadRequestException('Invalid prepTime');
    }

    const saved = await this.recipeModel.create({
      ...dto,
      prepTime: prepTimeMinutes,
      author: new Types.ObjectId(currentUserId),
    });

    try {
      if (image) {
        const uploadResult = await this.cloudinaryService.uploadImage(
          image.buffer,
          `${CLOUDINARY_RECIPES_FOLDER}/${saved._id}`,
        );

        saved.imageUrl = uploadResult.secure_url;
        await saved.save();
      }
    } catch (error) {
      // Log the error but don't fail the whole request since the recipe itself was created successfully
      this.logger.error(
        `[create] Failed to upload image for recipe ${saved._id}: ${error.message}`,
      );
    }

    const recipe = await this.recipeModel
      .findById(saved._id)
      .populate('author');

    return recipe?.toJSON();
  }

  async update(
    recipeId: string,
    dto: UpdateRecipeDto,
    currentUserId: string,
    image?: Express.Multer.File,
  ) {
    let prepTimeMinutes: number | undefined;
    if (dto.prepTime) {
      prepTimeMinutes = parseInt(dto.prepTime, 10);
      if (isNaN(prepTimeMinutes) || prepTimeMinutes <= 0) {
        throw new BadRequestException('Invalid prepTime');
      }
    }

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
        { $set: { ...dto, prepTime: prepTimeMinutes } },
        { returnDocument: 'after' },
      )
      .populate('author');

    if (!updated) {
      throw new NotFoundException('Recipe not found after update');
    }

    if (image) {
      try {
        const uploadResult = await this.cloudinaryService.uploadImage(
          image.buffer,
          `${CLOUDINARY_RECIPES_FOLDER}/${recipeId}`,
        );

        updated.imageUrl = uploadResult.secure_url;

        await this.recipeModel.findByIdAndUpdate(recipeId, {
          $set: { imageUrl: uploadResult.secure_url },
        });

        updated.imageUrl = uploadResult.secure_url; // keep up-to-date for response
      } catch (error) {
        this.logger.error(
          `[update]: Failed to upload image for recipe ${recipeId}: ${error.message}`,
        );
      }
    }

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

  async toggleLike(recipeId: string, userId: string) {
    const recipe = await this.recipeModel.findById(recipeId).select('likes');

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    const userObjectId = new Types.ObjectId(userId);

    const alreadyLiked = recipe.likes.some((id) => id.toString() === userId);

    let updatedRecipe;

    if (alreadyLiked) {
      // UNLIKE
      updatedRecipe = await this.recipeModel.findByIdAndUpdate(
        recipeId,
        { $pull: { likes: userObjectId } },
        { returnDocument: 'after' },
      );
    } else {
      // LIKE
      updatedRecipe = await this.recipeModel.findByIdAndUpdate(
        recipeId,
        { $addToSet: { likes: userObjectId } },
        { returnDocument: 'after' },
      );
    }

    return {
      liked: !alreadyLiked,
      likesCount: updatedRecipe?.likes.length ?? 0,
    };
  }
}
