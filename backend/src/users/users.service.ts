import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

import { User, UserDocument } from './schemas/user.schema';

import { UpdateUserDto } from './schemas/dto/update-user.dto';
import { CLOUDINARY_AVATARS_FOLDER } from 'src/cloudinary/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: dto },
      { new: true, runValidators: true },
    );

    if (!updated) {
      throw new NotFoundException('Failed to update user profile');
    }

    return updated.toJSON();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.toJSON();
  }

  async updateUserAvatar(userId: string, image: Express.Multer.File) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const uploadResult = await this.cloudinaryService.uploadImage(
        image.buffer,
        `${CLOUDINARY_AVATARS_FOLDER}/${userId}`,
      );

      user.avatarUrl = uploadResult.secure_url;
      user.avatarPublicId = uploadResult.public_id;

      await user.save();

      return user.toJSON();
    } catch (error) {
      throw new InternalServerErrorException('Failed to update avatar image');
    }
  }
}
