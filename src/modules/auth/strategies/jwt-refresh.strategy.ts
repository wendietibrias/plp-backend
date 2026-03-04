import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt.interface';
import { UserService } from '../services/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  private readonly logger = new Logger(JwtRefreshStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
  ) {
    super({
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.signedCookies) {
          token = req.signedCookies['refresh_token'];
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload.sub || !payload.username) {
      this.logger.warn('Invalid JWT payload structure');
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = (await this.usersService.findOne(payload.sub)).data;
    if (!user) {
      this.logger.warn(`User not found for ID: ${payload.sub}`);
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
