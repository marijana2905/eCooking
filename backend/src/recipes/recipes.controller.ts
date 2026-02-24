import {
  Controller,
  Post,
  Delete,
  Body,
  Req,
  Param,
  Patch,
  Get,
  Query,
} from '@nestjs/common';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipesService } from './recipes.service';
import { RecipeCategory } from './schemas/recipe.schema';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateRecipeDto) {
    const user = req['user'] as JwtPayload;
    return this.recipesService.create(dto, user.sub);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const user = req['user'] as JwtPayload;
    return this.recipesService.remove(id, user.sub);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateRecipeDto,
  ) {
    const user = req['user'] as JwtPayload;
    return this.recipesService.update(id, dto, user.sub);
  }
}
