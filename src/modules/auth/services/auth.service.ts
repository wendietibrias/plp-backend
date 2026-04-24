import { AppConfigService } from '@/config/services/app.config.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/auth.dto';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt.interface';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const foundComparableUser = await this.usersService.findByUsername(
      loginDto.username,
    );

    if (!foundComparableUser)
      throw new BadRequestException('Username tidak ditemukan');

    if (!(await foundComparableUser.comparePassword(loginDto.password)))
      throw new BadRequestException('Password salah');

    const foundUser = (await this.usersService.findOne(foundComparableUser.id))
      .data;

    const payload: JwtPayload = {
      sub: foundUser.id,
      username: foundUser.username,
    };

    return {
      user: foundUser,
      access: this.generateAccessToken(payload),
      refresh: this.generateRefreshToken(payload),
    };
  }

  async register(){}

  async refreshToken(user: User) {
    const foundUser = (await this.usersService.findOne(user.id)).data;

    const payload: JwtPayload = {
      sub: foundUser.id,
      username: foundUser.username,
    };

    return {
      access: this.generateAccessToken(payload),
      refresh: this.generateRefreshToken(payload),
    };
  }

  async me(user: User) {
    const foundUser = (await this.usersService.findOne(user.id)).data;

    return foundUser;
  }

  generateAccessToken(payload: JwtPayload) {
    try {
      return this.jwtService.sign(payload, {
        secret: this.appConfigService.jwt?.secret,
        expiresIn: this.appConfigService.jwt?.expiresIn,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Gagal generate access token');
    }
  }

  generateRefreshToken(payload: JwtPayload) {
    try {
      return this.jwtService.sign(payload, {
        secret: this.appConfigService.jwtRefresh?.secret,
        expiresIn: this.appConfigService.jwtRefresh?.expiresIn,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Gagal generate refresh token');
    }
  }
}
