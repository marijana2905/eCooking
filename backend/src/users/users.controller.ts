import { Controller, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './schemas/dto/update-user.dto';
import { UpdateAvatarDto } from './schemas/dto/update-avatar.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint za osnovne informacije: PATCH /users/me
  @Patch('me')
  async updateMe(@Req() req: any, @Body() dto: UpdateUserDto) {
    const user = req.user as JwtPayload; // Uzimamo ID iz tokena
    return this.usersService.updateProfile(user.sub, dto);
  }

  // Endpoint za avatar: PATCH /users/me/avatar
  @Patch('me/avatar')
  async updateAvatar(@Req() req: any, @Body() dto: UpdateAvatarDto) {
    const user = req.user as JwtPayload;
    return this.usersService.updateAvatar(user.sub, dto);
  }
}
