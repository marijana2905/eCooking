import { Controller, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './schemas/dto/update-user.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  async updateMe(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const user = req['user'] as JwtPayload;
    return this.usersService.updateProfile(user.sub, dto);
  }
}
