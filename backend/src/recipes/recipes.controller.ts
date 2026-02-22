import {
  Controller,
  Post,
  Delete,
  Put,
  Body,
  Req,
  Param,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  async create(@Body() dto: any, @Req() req: any) {
    return this.recipesService.create(dto, req.user.sub);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.recipesService.remove(id, req.user.sub);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any, @Req() req: any) {
    return this.recipesService.update(id, dto, req.user.sub);
  }
}
