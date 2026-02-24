import {
  Controller,
  Post,
  Delete,
  Body,
  Req,
  Param,
  Patch,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { ImageUploadInterceptor } from 'src/common/interceptors/image-upload.interceptor';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

import { RecipesService } from './recipes.service';
import { JwtGlobalModule } from 'src/jwt/jwt.module';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  // TODO: Add pagination, filtering, and sorting to the GET endpoint for displaying on home page

  @Post()
  @UseInterceptors(ImageUploadInterceptor())
  async create(
    @Req() req: Request,
    @Body() dto: CreateRecipeDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const user = req['user'] as JwtPayload;
    return this.recipesService.create(dto, user.sub, image);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const user = req['user'] as JwtPayload;
    return this.recipesService.remove(id, user.sub);
  }

  @Patch(':id')
  @UseInterceptors(ImageUploadInterceptor())
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateRecipeDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const user = req['user'] as JwtPayload;
    return this.recipesService.update(id, dto, user.sub, image);
  }

  
  @Patch(':id/like')
  async toggleLike(@Req() req: Request, @Param('id') id: string) {
    const user = req['user'] as JwtPayload;
    return this.recipesService.toggleLike(id, user.sub);
  }
}
