import { CurrentUser } from '@/commons/decorators/current-user.decorator';
import { Body, Controller, Patch, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { LoginDto } from '../dtos/auth.dto';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RefreshJwtAuthGuard } from '../guards/refresh-jwt-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { access, refresh, user } = await this.authService.login(body);

    this.setCookies(res, access, refresh);

    return res.status(200).json({
      message: 'Login berhasil',
      data: {
        user,
        access,
      },
    });
  }

  @Patch('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  async refresh(@Res() res: Response, @CurrentUser() user: User) {
    const { access, refresh } = await this.authService.refreshToken(user);

    this.setCookies(res, access, refresh);

    res.status(200).json({
      message: 'Token berhasil diperbarui',
      data: {
        access,
      },
    });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response) {
    res.clearCookie('refresh_token');
    res.clearCookie('access_token');
    res.status(200).json({
      message: 'Logout berhasil',
    });
  }

  private setCookies(res: Response, access: string, refresh: string) {
    res.cookie('refresh_token', refresh, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.cookie('access_token', access, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });
  }
}
