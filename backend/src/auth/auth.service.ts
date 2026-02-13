import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';
import * as bcrypt from 'bcrypt';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from 'src/users/schemas/user.schema';

import { hashPassword } from 'src/common/security/password-hash';
import { verifyPassword } from 'src/common/security/password-verification';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.userModel
      .findOne({
        $or: [{ email: registerDto.email }, { username: registerDto.username }],
      })
      .lean()
      .exec();

    if (existing) {
      throw new ConflictException('Email or username already in use');
    }

    const passwordHash = await hashPassword(registerDto.password);

    const user = new this.userModel({
      email: registerDto.email,
      username: registerDto.username,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      password: passwordHash,
    });

    const saved = await user.save();

    return {
      id: saved._id.toString(),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel
      .findOne({ email: loginDto.email })
      .select('+password')
      .exec();

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await verifyPassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const { accessToken, refreshToken } = await this.getTokens(
      user._id.toString(),
      user.email,
      user.username,
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userModel.updateOne(
      { _id: user._id },
      { currentHashedRefreshToken: hashedRefreshToken },
    );

    return {
      accessToken,
      refreshToken,
      user: user.toJSON(),
    };
  }

  async logout(userId: string) {
    return await this.userModel.updateOne(
      { _id: userId },
      { currentHashedRefreshToken: null },
    );
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userModel
      .findById(payload.sub)
      .select('+currentHashedRefreshToken');

    if (!user || !user.currentHashedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.getTokens(
      user._id.toString(),
      user.email,
      user.username,
    );

    const newHashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userModel.updateOne(
      { _id: user._id },
      { currentHashedRefreshToken: newHashedRefreshToken },
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: user.toJSON(),
    };
  }

  private async getTokens(userId: string, email: string, username: string) {
    const payload: JwtPayload = { sub: userId, email, username };

    const refreshTokenExpiry =
      this.configService.get<StringValue>('JWT_REFRESH_EXPIRY');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, { expiresIn: refreshTokenExpiry }),
    ]);

    return { accessToken, refreshToken };
  }
}
