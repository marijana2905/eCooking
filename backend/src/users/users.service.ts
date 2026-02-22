import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './schemas/dto/update-user.dto';
import { UpdateAvatarDto } from './schemas/dto/update-avatar.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Metoda 1: Ažuriranje profila (ime, prezime, bio)
  async updateProfile(userId: string, dto: UpdateUserDto) {
    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: dto },
      { new: true, runValidators: true },
    );

    if (!updated) throw new NotFoundException('Korisnik nije pronađen');
    return updated.toJSON();
  }

  // Metoda 2: Ažuriranje samo avatara
  async updateAvatar(userId: string, dto: UpdateAvatarDto) {
    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          avatarUrl: dto.avatarUrl,
          avatarPublicId: dto.avatarPublicId,
        },
      },
      { new: true },
    );

    if (!updated) throw new NotFoundException('Korisnik nije pronađen');
    return updated.toJSON();
  }
}
