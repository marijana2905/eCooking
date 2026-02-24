import { Controller, Patch, Body, Req, Param, Get } from '@nestjs/common';
import { UsersService } from './users.service';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { UpdateUserDto } from './schemas/dto/update-user.dto';

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
}
