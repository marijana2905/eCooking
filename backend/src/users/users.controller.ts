import {
  Controller,
  Patch,
  Body,
  Req,
  Param,
  Get,
  Put,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';

import { ImageUploadInterceptor } from 'src/common/interceptors/image-upload.interceptor';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { UpdateUserDto } from './schemas/dto/update-user.dto';

import { UsersService } from './users.service';
import { RecipesService } from 'src/recipes/recipes.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly recipesService: RecipesService,
  ) {}

  @Get('me/liked-recipes')
  async getMyLikedRecipes(
    @Req() req: Request,
    @Query() query: PaginationQueryDto,
  ) {
    const user = req['user'] as JwtPayload;
    return this.recipesService.findLikedRecipes(query, user.sub);
  }

  @Get('me/recipes')
  async getMyRecipes(@Req() req: Request, @Query() query: PaginationQueryDto) {
    const user = req['user'] as JwtPayload;
    return this.recipesService.findMyRecipes(query, user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get(':id/recipes')
  async getUserRecipes(
    @Req() req: Request,
    @Param('id') id: string,
    @Query() query: PaginationQueryDto,
  ) {
    const user = req['user'] as JwtPayload;
    return this.recipesService.findUserRecipes(query, id, user.sub);
  }

  @Patch('me')
  async updateMe(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const user = req['user'] as JwtPayload;
    return this.usersService.updateProfile(user.sub, dto);
  }

  @Put('avatar')
  @UseInterceptors(ImageUploadInterceptor())
  updateUserAvatar(
    @Req() request: Request,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const user = request['user'] as JwtPayload;
    return this.usersService.updateUserAvatar(user.sub, image);
  }
}
