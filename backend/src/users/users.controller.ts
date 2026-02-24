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
} from '@nestjs/common';

import { ImageUploadInterceptor } from 'src/common/interceptors/image-upload.interceptor';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { UpdateUserDto } from './schemas/dto/update-user.dto';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
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
