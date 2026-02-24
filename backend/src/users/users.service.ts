import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';

import { UpdateUserDto } from './schemas/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: dto },
      { new: true, runValidators: true },
    );

    if (!updated) {
      throw new NotFoundException('User is not found');
    }

    return updated.toJSON();
  }
  async findById(id: string) {
    const user = await this.userModel.findById(id);
    
    if (!user) {
      throw new NotFoundException('User with this ID does not exist');
    }

    return user.toJSON(); 
  }
}
